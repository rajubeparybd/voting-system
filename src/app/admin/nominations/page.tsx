'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    getNominations,
    updateNomination,
    deleteNomination,
} from '@/actions/nomination';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
    Pencil,
    Trash2,
    PlusCircle,
    Users2,
    Eye,
    Lock,
    MoreVertical,
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type NominationStatus = 'ACTIVE' | 'INACTIVE' | 'CLOSED';

interface Club {
    id: string;
    name: string;
}

interface Nomination {
    id: string;
    clubId: string;
    club: Club;
    position: string;
    description: string;
    status: NominationStatus;
    startDate: Date;
    endDate: Date;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    applications: any[];
    createdAt: Date;
    updatedAt: Date;
}

// const STATUS_OPTIONS: NominationStatus[] = ['ACTIVE', 'INACTIVE', 'CLOSED'];

export default function NominationsPage() {
    const [nominations, setNominations] = useState<Nomination[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [closeDialogOpen, setCloseDialogOpen] = useState(false);
    const [nominationToDelete, setNominationToDelete] = useState<string | null>(
        null
    );
    const [nominationToClose, setNominationToClose] = useState<string | null>(
        null
    );
    const router = useRouter();

    useEffect(() => {
        const fetchNominations = async () => {
            try {
                const nominationsData = await getNominations();
                setNominations(nominationsData as Nomination[]);
            } catch (error) {
                console.error('Failed to fetch nominations:', error);
                toast.error('Failed to load nominations');
            } finally {
                setLoading(false);
            }
        };

        fetchNominations();
    }, []);

    const handleDeleteClick = (id: string) => {
        setNominationToDelete(id);
        setDeleteDialogOpen(true);
    };

    const handleCloseClick = (id: string) => {
        setNominationToClose(id);
        setCloseDialogOpen(true);
    };

    const handleViewCandidates = (id: string) => {
        router.push(`/admin/nominations/${id}/candidates`);
    };

    const handleConfirmDelete = async () => {
        if (!nominationToDelete) return;

        try {
            // Call the deleteNomination API function
            await deleteNomination(nominationToDelete);
            // Update the local state
            setNominations(
                nominations.filter(n => n.id !== nominationToDelete)
            );
            toast.success('Nomination deleted successfully');
        } catch (error) {
            console.error('Failed to delete nomination:', error);
            toast.error('Failed to delete nomination');
        } finally {
            setDeleteDialogOpen(false);
            setNominationToDelete(null);
        }
    };

    const handleConfirmClose = async () => {
        if (!nominationToClose) return;

        try {
            // Set the status to CLOSED
            const nomination = nominations.find(
                n => n.id === nominationToClose
            );
            if (nomination) {
                await updateNomination(nominationToClose, {
                    clubId: nomination.clubId,
                    position: nomination.position,
                    description: nomination.description,
                    status: 'CLOSED',
                    startDate: nomination.startDate.toISOString().split('T')[0],
                    endDate: nomination.endDate.toISOString().split('T')[0],
                });

                // Update the local state
                setNominations(
                    nominations.map(n =>
                        n.id === nominationToClose
                            ? { ...n, status: 'CLOSED' as NominationStatus }
                            : n
                    )
                );
                toast.success('Nomination closed successfully');
            }
        } catch (error) {
            console.error('Failed to close nomination:', error);
            toast.error('Failed to close nomination');
        } finally {
            setCloseDialogOpen(false);
            setNominationToClose(null);
        }
    };

    const getStatusBadge = (status: NominationStatus) => {
        switch (status) {
            case 'ACTIVE':
                return <Badge variant="success">Active</Badge>;
            case 'INACTIVE':
                return <Badge variant="destructive">Inactive</Badge>;
            case 'CLOSED':
                return <Badge variant="outline">Closed</Badge>;
            default:
                return <Badge variant="outline">Unknown</Badge>;
        }
    };

    const renderNominationList = () => {
        if (loading) {
            return (
                <div className="flex h-64 items-center justify-center">
                    <div className="flex items-center space-x-4">
                        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-500"></div>
                        <p className="text-gray-400">Loading nominations...</p>
                    </div>
                </div>
            );
        }

        if (nominations.length === 0) {
            return (
                <div className="flex h-72 flex-col items-center justify-center rounded-lg border border-gray-700 bg-gray-800/50">
                    <div className="mb-4 rounded-full border-2 border-gray-700 p-4">
                        <Users2 className="h-8 w-8 text-gray-500" />
                    </div>
                    <p className="mb-4 text-lg text-gray-400">
                        No nominations found
                    </p>
                    <Button
                        onClick={() => router.push('/admin/nominations/new')}
                        className="border-gray-700 bg-gray-700 text-gray-200 hover:bg-gray-600"
                    >
                        <PlusCircle className="mr-2 h-4 w-4" /> Create your
                        first nomination
                    </Button>
                </div>
            );
        }

        return (
            <div className="overflow-hidden rounded-lg border border-gray-700 bg-gray-800/50">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Club</TableHead>
                            <TableHead>Position</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Start Date</TableHead>
                            <TableHead>End Date</TableHead>
                            <TableHead>Applications</TableHead>
                            <TableHead className="text-right">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {nominations.map(nomination => (
                            <TableRow key={nomination.id}>
                                <TableCell className="font-medium text-gray-200">
                                    {nomination.club.name}
                                </TableCell>
                                <TableCell className="font-medium text-gray-200">
                                    {nomination.position}
                                </TableCell>
                                <TableCell className="max-w-xs truncate text-gray-400">
                                    {nomination.description}
                                </TableCell>
                                <TableCell>
                                    {getStatusBadge(
                                        nomination.status as NominationStatus
                                    )}
                                </TableCell>
                                <TableCell className="text-gray-400">
                                    {new Date(
                                        nomination.startDate
                                    ).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="text-gray-400">
                                    {new Date(
                                        nomination.endDate
                                    ).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="text-gray-400">
                                    {nomination.applications.length}
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
                                            >
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem
                                                className="flex cursor-pointer items-center text-amber-300 hover:text-amber-100"
                                                onClick={() =>
                                                    handleViewCandidates(
                                                        nomination.id
                                                    )
                                                }
                                            >
                                                <Eye className="mr-2 h-4 w-4" />
                                                View Candidates
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="flex cursor-pointer items-center text-indigo-300 hover:text-indigo-100"
                                                onClick={() =>
                                                    router.push(
                                                        `/admin/nominations/${nomination.id}/edit`
                                                    )
                                                }
                                            >
                                                <Pencil className="mr-2 h-4 w-4" />
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="flex cursor-pointer items-center text-blue-300 hover:text-blue-100"
                                                onClick={() =>
                                                    handleCloseClick(
                                                        nomination.id
                                                    )
                                                }
                                                disabled={
                                                    nomination.status ===
                                                    'CLOSED'
                                                }
                                            >
                                                <Lock className="mr-2 h-4 w-4" />
                                                Close Nomination
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="flex cursor-pointer items-center text-red-500 hover:text-red-300"
                                                onClick={() =>
                                                    handleDeleteClick(
                                                        nomination.id
                                                    )
                                                }
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
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
                        Nominations
                    </h1>
                    <p className="text-gray-400">
                        Manage position nominations for clubs
                    </p>
                </div>
                <Button
                    onClick={() => router.push('/admin/nominations/new')}
                    className="bg-indigo-600 text-white hover:bg-indigo-700"
                >
                    <PlusCircle className="mr-2 h-4 w-4" /> Create Nomination
                </Button>
            </div>

            {renderNominationList()}

            {/* Close Dialog */}
            <Dialog open={closeDialogOpen} onOpenChange={setCloseDialogOpen}>
                <DialogContent className="border-gray-700 bg-gray-800 text-white sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Close Nomination</DialogTitle>
                        <DialogDescription className="text-gray-400">
                            Are you sure you want to close this nomination? This
                            will prevent new applications.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setCloseDialogOpen(false)}
                            className="border-gray-600 bg-gray-700 text-gray-200 hover:bg-gray-600"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleConfirmClose}
                            className="bg-blue-600 text-white hover:bg-blue-700"
                        >
                            Close Nomination
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent className="border-gray-700 bg-gray-800 text-white sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Delete Nomination</DialogTitle>
                        <DialogDescription className="text-gray-400">
                            Are you sure you want to permanently delete this
                            nomination? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteDialogOpen(false)}
                            className="border-gray-600 bg-gray-700 text-gray-200 hover:bg-gray-600"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleConfirmDelete}
                            className="bg-red-600 text-white hover:bg-red-700"
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
