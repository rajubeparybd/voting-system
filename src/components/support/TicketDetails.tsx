'use client';

import { useActionState } from '@/hooks/useActionState';
import { useFormStatus } from 'react-dom';
import { addTicketMessage, updateTicketStatus } from '@/actions/support';
import { Button } from '@/components/ui/button';
import { FormError } from '@/components/ui/form-error';
import { FormSuccess } from '@/components/ui/form-success';
import { formatDistanceToNow } from 'date-fns';
import { Role } from '@prisma/client';
import { Avatar } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { FiLoader } from 'react-icons/fi';

interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    studentId?: string | null;
    role?: Role[];
    department?: string | null;
    image?: string | null;
}

interface SupportMessage {
    id: string;
    content: string;
    createdAt: Date;
    userId: string;
    isStaff: boolean;
    user: {
        name: string | null;
        image: string | null;
        role: Role[];
    };
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
    user: User;
}

interface TicketDetailsProps {
    ticket: SupportTicket;
    currentUser: User;
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

function UpdateButton() {
    const { pending } = useFormStatus();

    return (
        <Button type="submit" disabled={pending}>
            {pending ? (
                <span className="flex items-center justify-center gap-2">
                    <FiLoader className="animate-spin" />
                    Updating...
                </span>
            ) : (
                'Update Status'
            )}
        </Button>
    );
}

function SendButton() {
    const { pending } = useFormStatus();

    return (
        <Button type="submit" className="w-full" disabled={pending}>
            {pending ? (
                <span className="flex items-center justify-center gap-2">
                    <FiLoader className="animate-spin" />
                    Sending...
                </span>
            ) : (
                'Send Message'
            )}
        </Button>
    );
}

export function TicketDetails({ ticket, currentUser }: TicketDetailsProps) {
    const isAdmin = currentUser.role?.includes('ADMIN');
    const [messageState, messageAction] = useActionState(addTicketMessage, {
        success: false,
        message: '',
    });
    const [statusState, statusAction] = useActionState(updateTicketStatus, {
        success: false,
        message: '',
    });

    const clientMessageAction = async (formData: FormData) => {
        const result = await messageAction(formData);
        if (result?.success) {
            toast.success(result.message);
        } else if (result?.message) {
            toast.error(result.message);
        }
    };

    const clientStatusAction = async (formData: FormData) => {
        const result = await statusAction(formData);
        if (result?.success) {
            toast.success(result.message);
        } else if (result?.message) {
            toast.error(result.message);
        }
    };

    return (
        <div className="space-y-6">
            <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold text-gray-200">
                        {ticket.title}
                    </h2>
                    <div className="flex items-center gap-3">
                        <span
                            className={`rounded-full px-3 py-1 text-sm ${
                                priorityColors[ticket.priority]
                            }`}
                        >
                            {ticket.priority}
                        </span>
                        <span
                            className={`rounded-full px-3 py-1 text-sm ${
                                statusColors[ticket.status]
                            }`}
                        >
                            {ticket.status}
                        </span>
                    </div>
                </div>
                <div className="mt-4 flex items-center gap-4">
                    <Avatar
                        src={ticket.user.image}
                        alt={ticket.user.name || 'User'}
                        fallback={(ticket.user.name || 'U')
                            .split(' ')
                            .map(n => n[0])
                            .join('')
                            .toUpperCase()}
                    />
                    <div className="flex-1">
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                            <span>
                                Created by:{' '}
                                {ticket.user.name ||
                                    ticket.user.studentId ||
                                    'Unknown User'}
                            </span>
                            <span>•</span>
                            <span>Category: {ticket.category}</span>
                            <span>•</span>
                            <span>
                                Created{' '}
                                {formatDistanceToNow(
                                    new Date(ticket.createdAt),
                                    {
                                        addSuffix: true,
                                    }
                                )}
                            </span>
                        </div>
                    </div>
                </div>
                <p className="mt-4 text-gray-300">{ticket.description}</p>

                {isAdmin && ticket.status !== 'CLOSED' && (
                    <form action={clientStatusAction} className="mt-6">
                        <input
                            type="hidden"
                            name="ticketId"
                            value={ticket.id}
                        />
                        <div className="flex items-center gap-4">
                            <select
                                name="status"
                                defaultValue={ticket.status}
                                className="rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-gray-200"
                            >
                                <option value="OPEN">Open</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="RESOLVED">Resolved</option>
                                <option value="CLOSED">Closed</option>
                            </select>
                            <select
                                name="priority"
                                defaultValue={ticket.priority}
                                className="rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-gray-200"
                            >
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                                <option value="URGENT">Urgent</option>
                            </select>
                            <UpdateButton />
                        </div>
                        {!statusState.success && statusState.message && (
                            <FormError message={statusState.message} />
                        )}
                        {statusState.success && (
                            <FormSuccess message={statusState.message} />
                        )}
                    </form>
                )}
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-200">Messages</h3>
                <div className="space-y-4">
                    {ticket.messages.map(message => (
                        <div
                            key={message.id}
                            className={`flex gap-4 rounded-lg border border-gray-700 bg-gray-800/50 p-4 ${
                                message.isStaff ? 'ml-8' : 'mr-8'
                            }`}
                        >
                            <Avatar
                                src={message.user.image}
                                alt={message.user.name || 'User'}
                                className={
                                    message.isStaff
                                        ? 'bg-blue-500/20'
                                        : 'bg-gray-500/20'
                                }
                                fallback={(message.user.name || 'U')
                                    .split(' ')
                                    .map(n => n[0])
                                    .join('')
                                    .toUpperCase()}
                            />
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <span className="font-medium text-gray-200">
                                        {message.user.name || 'Unknown User'}{' '}
                                        {message.isStaff && (
                                            <span className="ml-2 rounded bg-blue-500/10 px-2 py-0.5 text-xs text-blue-500">
                                                Staff
                                            </span>
                                        )}
                                    </span>
                                    <span className="text-sm text-gray-400">
                                        {formatDistanceToNow(
                                            new Date(message.createdAt),
                                            { addSuffix: true }
                                        )}
                                    </span>
                                </div>
                                <p className="mt-1 text-gray-300">
                                    {message.content}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {ticket.status !== 'CLOSED' && (
                    <form action={clientMessageAction} className="mt-6">
                        <input
                            type="hidden"
                            name="ticketId"
                            value={ticket.id}
                        />
                        <div className="space-y-4">
                            <textarea
                                name="content"
                                required
                                rows={4}
                                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-gray-200"
                                placeholder="Type your message here..."
                            />
                            {!messageState.success && messageState.message && (
                                <FormError message={messageState.message} />
                            )}
                            {messageState.success && (
                                <FormSuccess message={messageState.message} />
                            )}
                            <SendButton />
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
