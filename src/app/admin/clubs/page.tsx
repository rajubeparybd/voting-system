'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Pencil, Trash2, Users2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { getClubs, deleteClub } from '@/actions/club';
import Image from 'next/image';
import { toast } from 'sonner';

// Define the status options and use them in the component
const STATUS_OPTIONS = ['ACTIVE', 'INACTIVE', 'PENDING'] as const;
type ClubStatus = (typeof STATUS_OPTIONS)[number];

interface Club {
    id: string;
    name: string;
    description: string;
    image: string;
    status: ClubStatus;
    open_date: Date | null;
    members: string[];
    positions: string[];
}

interface RawClub extends Omit<Club, 'status'> {
    status: string;
}

export default function ClubsPage() {
    const [clubs, setClubs] = useState<Club[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchClubs = async () => {
            try {
                const clubsData = await getClubs();
                // Validate that all clubs have valid status
                const validClubs = (clubsData as RawClub[]).filter(club =>
                    STATUS_OPTIONS.includes(club.status as ClubStatus)
                );
                setClubs(validClubs as Club[]);
            } catch (error) {
                console.error('Failed to fetch clubs:', error);
                toast.error('Failed to load clubs');
            } finally {
                setLoading(false);
            }
        };

        fetchClubs();
    }, []);

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this club?')) {
            try {
                await deleteClub(id);
                setClubs(clubs.filter(club => club.id !== id));
                toast.success('Club deleted successfully');
            } catch (error) {
                console.error('Failed to delete club:', error);
                toast.error('Failed to delete club');
            }
        }
    };

    const getStatusBadge = (status: ClubStatus) => {
        switch (status) {
            case 'ACTIVE':
                return <Badge variant="success">Active</Badge>;
            case 'INACTIVE':
                return <Badge variant="destructive">Inactive</Badge>;
            case 'PENDING':
                return <Badge variant="warning">Pending</Badge>;
            default:
                return <Badge variant="outline">Unknown</Badge>;
        }
    };

    const renderClubList = () => {
        if (loading) {
            return (
                <div className="flex h-64 items-center justify-center">
                    <div className="flex items-center space-x-4">
                        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-500"></div>
                        <p className="text-gray-400">Loading clubs...</p>
                    </div>
                </div>
            );
        }

        if (clubs.length === 0) {
            return (
                <div className="flex h-72 flex-col items-center justify-center rounded-lg border border-gray-700 bg-gray-800/50">
                    <div className="mb-4 rounded-full border-2 border-gray-700 p-4">
                        <Users2 className="h-8 w-8 text-gray-500" />
                    </div>
                    <p className="mb-4 text-lg text-gray-400">No clubs found</p>
                    <Button
                        onClick={() => router.push('/admin/clubs/new')}
                        className="border-gray-700 bg-gray-700 text-gray-200 hover:bg-gray-600"
                    >
                        <PlusCircle className="mr-2 h-4 w-4" /> Create your
                        first club
                    </Button>
                </div>
            );
        }

        return (
            <div className="overflow-hidden rounded-lg border border-gray-700 bg-gray-800/50">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Image</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Open Date</TableHead>
                            <TableHead>Members</TableHead>
                            <TableHead>Positions</TableHead>
                            <TableHead className="text-right">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {clubs.map(club => (
                            <TableRow key={club.id}>
                                <TableCell>
                                    {club.image && (
                                        <div className="relative h-10 w-10 overflow-hidden rounded-full border border-gray-700">
                                            <Image
                                                src={club.image}
                                                alt={club.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell className="font-medium text-gray-200">
                                    {club.name}
                                </TableCell>
                                <TableCell className="max-w-xs truncate text-gray-400">
                                    {club.description}
                                </TableCell>
                                <TableCell>
                                    {getStatusBadge(club.status as ClubStatus)}
                                </TableCell>
                                <TableCell className="text-gray-400">
                                    {club.open_date
                                        ? new Date(
                                              club.open_date
                                          ).toLocaleDateString()
                                        : 'N/A'}
                                </TableCell>
                                <TableCell className="text-gray-400">
                                    {club.members.length}
                                </TableCell>
                                <TableCell className="text-gray-400">
                                    <div className="flex flex-wrap gap-1">
                                        {(club.positions || []).map(
                                            (position, index) => (
                                                <span
                                                    key={index}
                                                    className="rounded-full bg-gray-700 px-2 py-1 text-xs"
                                                >
                                                    {position}
                                                </span>
                                            )
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="border-gray-700 text-gray-300 hover:bg-gray-700"
                                            onClick={() =>
                                                router.push(
                                                    `/admin/clubs/${club.id}/edit`
                                                )
                                            }
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            className="bg-red-500/10 text-red-500 hover:bg-red-500/30"
                                            onClick={() =>
                                                handleDelete(club.id)
                                            }
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        );
    };

    return (
        <div className="container mx-auto px-4 py-10">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="mb-2 text-3xl font-bold text-white">
                        Clubs Management
                    </h1>
                    <p className="text-gray-400">
                        Manage and organize your clubs
                    </p>
                </div>
                <Button
                    onClick={() => router.push('/admin/clubs/new')}
                    className="bg-indigo-600 text-white hover:bg-indigo-700"
                >
                    <PlusCircle className="mr-2 h-4 w-4" /> Add New Club
                </Button>
            </div>

            {renderClubList()}
        </div>
    );
}
