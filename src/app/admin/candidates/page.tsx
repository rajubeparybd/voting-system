'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Avatar } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface Candidate {
    id: string;
    nominationId: string;
    statement: string;
    status: 'APPROVED';
    createdAt: Date;
    user: {
        studentId: string;
        name: string;
        email: string;
        department: string;
        image: string | null;
    };
    nomination: {
        position: string;
        club: {
            name: string;
        };
    };
}

interface Filters {
    name: string;
    department: string;
    club: string;
}

export default function CandidatesPage() {
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>(
        []
    );
    const [loading, setLoading] = useState(true);
    const [uniqueDepartments, setUniqueDepartments] = useState<string[]>([]);
    const [uniqueClubs, setUniqueClubs] = useState<string[]>([]);
    const [filters, setFilters] = useState<Filters>({
        name: '',
        department: 'all',
        club: 'all',
    });

    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                const response = await fetch('/api/candidates/approved');
                if (!response.ok) {
                    throw new Error('Failed to fetch candidates');
                }
                const data = await response.json();
                setCandidates(data);
                setFilteredCandidates(data);

                // Extract unique departments and clubs with proper typing
                const departments = [
                    ...new Set(data.map((c: Candidate) => c.user.department)),
                ] as string[];
                const clubs = [
                    ...new Set(
                        data.map((c: Candidate) => c.nomination.club.name)
                    ),
                ] as string[];
                setUniqueDepartments(departments);
                setUniqueClubs(clubs);
            } catch (error) {
                console.error('Failed to fetch candidates:', error);
                toast.error('Failed to load candidates');
            } finally {
                setLoading(false);
            }
        };

        fetchCandidates();
    }, []);

    useEffect(() => {
        if (!candidates) return;

        const filtered = candidates.filter((candidate: Candidate) => {
            const nameMatch = candidate.user.name
                .toLowerCase()
                .includes(filters.name.toLowerCase());

            const departmentMatch =
                filters.department === 'all' ||
                candidate.user.department === filters.department;

            const clubMatch =
                filters.club === 'all' ||
                candidate.nomination.club.name === filters.club;

            return nameMatch && departmentMatch && clubMatch;
        });

        setFilteredCandidates(filtered);
    }, [candidates, filters]);

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({
            ...prev,
            [key]: value,
        }));
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
        <div className="container mx-auto space-y-6 p-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                    <Input
                        placeholder="Search by name..."
                        value={filters.name}
                        onChange={e =>
                            handleFilterChange('name', e.target.value)
                        }
                        className="w-full"
                    />
                </div>
                <div>
                    <Select
                        value={filters.department}
                        onValueChange={value =>
                            handleFilterChange('department', value)
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Filter by department" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Departments</SelectItem>
                            {uniqueDepartments.map(dept => (
                                <SelectItem key={dept} value={dept}>
                                    {dept}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Select
                        value={filters.club}
                        onValueChange={value =>
                            handleFilterChange('club', value)
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Filter by club" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Clubs</SelectItem>
                            {uniqueClubs.map(club => (
                                <SelectItem key={club} value={club}>
                                    {club}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {filteredCandidates.length === 0 ? (
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
                        No approved candidates found
                    </p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-lg border border-gray-700 bg-gray-800/50">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Student ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Avatar</TableHead>
                                <TableHead>Department</TableHead>
                                <TableHead>Club</TableHead>
                                <TableHead>Position</TableHead>
                                <TableHead>Applied On</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredCandidates.map(candidate => (
                                <TableRow key={candidate.id}>
                                    <TableCell className="font-medium text-gray-200">
                                        {candidate.user.studentId}
                                    </TableCell>
                                    <TableCell className="text-gray-400">
                                        {candidate.user.name}
                                    </TableCell>
                                    <TableCell className="text-gray-400">
                                        {candidate.user.email}
                                    </TableCell>
                                    <TableCell>
                                        <Avatar
                                            src={candidate.user.image}
                                            alt={candidate.user.name}
                                            fallback={candidate.user.name
                                                .split(' ')
                                                .map(n => n[0])
                                                .join('')
                                                .toUpperCase()}
                                        />
                                    </TableCell>
                                    <TableCell className="text-gray-400">
                                        {candidate.user.department}
                                    </TableCell>
                                    <TableCell className="text-gray-400">
                                        {candidate.nomination.club.name}
                                    </TableCell>
                                    <TableCell className="text-gray-400">
                                        {candidate.nomination.position}
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
