'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { createSupportTicket } from '@/actions/support';
import { Button } from '@/components/ui/button';
import { FormError } from '@/components/ui/form-error';
import { FormSuccess } from '@/components/ui/form-success';
import { toast } from 'sonner';
import { FiLoader } from 'react-icons/fi';

const categories = [
    'General Inquiry',
    'Technical Issue',
    'Account Problem',
    'Feature Request',
    'Other',
];

const priorities = [
    { value: 'LOW', label: 'Low' },
    { value: 'MEDIUM', label: 'Medium' },
    { value: 'HIGH', label: 'High' },
    { value: 'URGENT', label: 'Urgent' },
];

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <Button type="submit" className="w-full" disabled={pending}>
            {pending ? (
                <span className="flex items-center justify-center gap-2">
                    <FiLoader className="animate-spin" />
                    Submitting...
                </span>
            ) : (
                'Submit Ticket'
            )}
        </Button>
    );
}

export function TicketForm() {
    const [state, formAction] = useActionState(createSupportTicket, {
        success: false,
        message: '',
    });

    const clientAction = async (formData: FormData) => {
        const result = await formAction(formData);
        if (result?.success) {
            toast.success(result.message);
        } else if (result?.message) {
            toast.error(result.message);
        }
    };

    return (
        <form action={clientAction} className="space-y-4">
            <div>
                <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-200"
                >
                    Title
                </label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-gray-200 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    placeholder="Brief description of your issue"
                />
            </div>

            <div>
                <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-200"
                >
                    Category
                </label>
                <select
                    id="category"
                    name="category"
                    required
                    className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-gray-200 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label
                    htmlFor="priority"
                    className="block text-sm font-medium text-gray-200"
                >
                    Priority
                </label>
                <select
                    id="priority"
                    name="priority"
                    required
                    className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-gray-200 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                >
                    <option value="">Select priority</option>
                    {priorities.map(priority => (
                        <option key={priority.value} value={priority.value}>
                            {priority.label}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-200"
                >
                    Description
                </label>
                <textarea
                    id="description"
                    name="description"
                    required
                    rows={4}
                    className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-gray-200 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    placeholder="Please provide details about your issue"
                />
            </div>

            {!state.success && state.message && (
                <FormError message={state.message} />
            )}
            {state.success && <FormSuccess message={state.message} />}

            <SubmitButton />
        </form>
    );
}
