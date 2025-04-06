interface FormErrorProps {
    message?: string;
}

export function FormError({ message }: FormErrorProps) {
    if (!message) return null;

    return (
        <div className="flex items-center gap-x-2 rounded-md bg-red-500/15 p-3 text-sm text-red-500">
            <span>{message}</span>
        </div>
    );
}
