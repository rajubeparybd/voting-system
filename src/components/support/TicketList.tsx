'use client';

import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface SupportMessage {
    id: string;
    content: string;
    createdAt: Date;
    userId: string;
    isStaff: boolean;
}

interface User {
    name: string | null;
    email: string | null;
    studentId: string | null;
}

interface SupportTicket {
    id: string;
    title: string;
    description: string;
    status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    category: string;
    createdAt: Date;
    messages: SupportMessage[];
    user?: User;
}

interface TicketListProps {
    tickets: SupportTicket[];
    isAdmin?: boolean;
}

const statusColors = {
    OPEN: 'bg-green-500/10 text-green-500',
    IN_PROGRESS: 'bg-blue-500/10 text-blue-500',
    RESOLVED: 'bg-gray-500/10 text-gray-500',
    CLOSED: 'bg-red-500/10 text-red-500',
} as const;

const priorityColors = {
    LOW: 'bg-gray-500/10 text-gray-500',
    MEDIUM: 'bg-yellow-500/10 text-yellow-500',
    HIGH: 'bg-orange-500/10 text-orange-500',
    URGENT: 'bg-red-500/10 text-red-500',
} as const;

const statusOptions = [
    { value: 'ALL', label: 'All Status' },
    { value: 'OPEN', label: 'Open' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'RESOLVED', label: 'Resolved' },
    { value: 'CLOSED', label: 'Closed' },
];

const priorityOptions = [
    { value: 'ALL', label: 'All Priority' },
    { value: 'LOW', label: 'Low' },
    { value: 'MEDIUM', label: 'Medium' },
    { value: 'HIGH', label: 'High' },
    { value: 'URGENT', label: 'Urgent' },
];

export function TicketList({ tickets, isAdmin = false }: TicketListProps) {
    const [selectedStatus, setSelectedStatus] = useState<string>('OPEN');
    const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
    const [filteredTickets, setFilteredTickets] = useState<SupportTicket[]>([]);

    useEffect(() => {
        let filtered = [...tickets];

        if (selectedStatus !== 'ALL') {
            filtered = filtered.filter(
                ticket => ticket.status === selectedStatus
            );
        }

        if (selectedPriority !== 'ALL') {
            filtered = filtered.filter(
                ticket => ticket.priority === selectedPriority
            );
        }

        setFilteredTickets(filtered);
    }, [tickets, selectedStatus, selectedPriority]);

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-4 rounded-lg border border-gray-700 bg-gray-800/50 p-4">
                <div className="flex items-center gap-2">
                    <label htmlFor="status" className="text-sm text-gray-400">
                        Status:
                    </label>
                    <select
                        id="status"
                        value={selectedStatus}
                        onChange={e => setSelectedStatus(e.target.value)}
                        className="rounded-md border border-gray-700 bg-gray-800 px-3 py-1 text-sm text-gray-200"
                    >
                        {statusOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex items-center gap-2">
                    <label htmlFor="priority" className="text-sm text-gray-400">
                        Priority:
                    </label>
                    <select
                        id="priority"
                        value={selectedPriority}
                        onChange={e => setSelectedPriority(e.target.value)}
                        className="rounded-md border border-gray-700 bg-gray-800 px-3 py-1 text-sm text-gray-200"
                    >
                        {priorityOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                        setSelectedStatus('ALL');
                        setSelectedPriority('ALL');
                    }}
                    className="ml-auto text-gray-400 hover:text-gray-200"
                >
                    Clear Filters
                </Button>
            </div>

            <div className="space-y-4">
                {filteredTickets.map(ticket => (
                    <Link
                        key={ticket.id}
                        href={`/${isAdmin ? 'admin' : 'user'}/support/${ticket.id}`}
                        className="block"
                    >
                        <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-6 transition-colors hover:bg-gray-800">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-medium text-gray-200">
                                    {ticket.title}
                                </h3>
                                <div className="flex items-center gap-2">
                                    <span
                                        className={`rounded-full px-2 py-1 text-xs ${
                                            priorityColors[ticket.priority]
                                        }`}
                                    >
                                        {ticket.priority}
                                    </span>
                                    <span
                                        className={`rounded-full px-2 py-1 text-xs ${
                                            statusColors[ticket.status]
                                        }`}
                                    >
                                        {ticket.status}
                                    </span>
                                </div>
                            </div>
                            <p className="mt-2 text-sm text-gray-400">
                                {ticket.description.length > 100
                                    ? `${ticket.description.slice(0, 100)}...`
                                    : ticket.description}
                            </p>
                            <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
                                <div className="flex items-center gap-2">
                                    <span>
                                        {ticket.messages.length}{' '}
                                        {ticket.messages.length === 1
                                            ? 'message'
                                            : 'messages'}
                                    </span>
                                    <span>•</span>
                                    <span>{ticket.category}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {isAdmin && ticket.user && (
                                        <>
                                            <span>
                                                {ticket.user.name ||
                                                    ticket.user.studentId ||
                                                    'Unknown User'}
                                            </span>
                                            <span>•</span>
                                        </>
                                    )}
                                    <span>
                                        Created{' '}
                                        {formatDistanceToNow(
                                            new Date(ticket.createdAt),
                                            { addSuffix: true }
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
                {filteredTickets.length === 0 && (
                    <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-8 text-center">
                        <p className="text-gray-400">No tickets found</p>
                    </div>
                )}
            </div>
        </div>
    );
}
