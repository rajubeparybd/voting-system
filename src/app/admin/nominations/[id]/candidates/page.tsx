'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

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
import { getNomination } from '@/actions/nomination';

interface Candidate {
    id: string;
    userId: string;
    nominationId: string;
    name: string;
    email: string;
    manifesto: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    createdAt: Date;
}

interface Nomination {
    id: string;
    clubId: string;
    club: {
        id: string;
        name: string;
    };
    position: string;
    description: string;
    status: 'ACTIVE' | 'INACTIVE' | 'CLOSED';
    startDate: Date;
    endDate: Date;
    applications: Candidate[];
}

export default function CandidatesPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const resolvedParams = use(params);
    const router = useRouter();
    const [nomination, setNomination] = useState<Nomination | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNomination = async () => {
            try {
                const nominationData = await getNomination(resolvedParams.id);
                if (nominationData) {
                    setNomination(nominationData as unknown as Nomination);
                } else {
                    toast.error('Nomination not found');
                    router.push('/admin/nominations');
                }
            } catch (error) {
                console.error('Failed to fetch nomination:', error);
                toast.error('Failed to load nomination data');
                router.push('/admin/nominations');
            } finally {
                setLoading(false);
            }
        };

        fetchNomination();
    }, [resolvedParams.id, router]);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'APPROVED':
                return <Badge variant="success">Approved</Badge>;
            case 'REJECTED':
                return <Badge variant="destructive">Rejected</Badge>;
            case 'PENDING':
                return <Badge variant="outline">Pending</Badge>;
            default:
                return <Badge variant="outline">Unknown</Badge>;
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-10">
                <div className="flex h-64 items-center justify-center">
                    <div className="flex items-center space-x-4">
                        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-500"></div>
                        <p className="text-gray-400">Loading candidates...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-10">
            <Button
                variant="ghost"
                className="mb-6 text-gray-400 hover:bg-gray-800 hover:text-white"
                onClick={() => router.push('/admin/nominations')}
            >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Nominations
            </Button>

            <div className="mb-8">
                <h1 className="mb-2 text-3xl font-bold text-white">
                    Candidates for {nomination?.position}
                </h1>
                <p className="text-gray-400">
                    {nomination?.club.name} - {nomination?.applications.length}{' '}
                    applications
                </p>
            </div>

            {nomination?.applications.length === 0 ? (
                <div className="flex h-72 flex-col items-center justify-center rounded-lg border border-gray-700 bg-gray-800/50">
                    <div className="mb-4 rounded-full border-2 border-gray-700 p-4">
                        <svg
                            className="h-8 w-8 text-gray-500"
                            fill="none"
                            height="24"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            width="24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                    </div>
                    <p className="mb-4 text-lg text-gray-400">
                        No candidates found for this nomination
                    </p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-lg border border-gray-700 bg-gray-800/50">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Manifesto</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Applied On</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {nomination?.applications.map(candidate => (
                                <TableRow key={candidate.id}>
                                    <TableCell className="font-medium text-gray-200">
                                        {candidate.name}
                                    </TableCell>
                                    <TableCell className="text-gray-400">
                                        {candidate.email}
                                    </TableCell>
                                    <TableCell className="max-w-xs truncate text-gray-400">
                                        {candidate.manifesto}
                                    </TableCell>
                                    <TableCell>
                                        {getStatusBadge(candidate.status)}
                                    </TableCell>
                                    <TableCell className="text-gray-400">
                                        {new Date(
                                            candidate.createdAt
                                        ).toLocaleDateString()}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
}
