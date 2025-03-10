'use client';

import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface ConfirmationDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: ReactNode;
    confirmText?: string;
    cancelText?: string;
    confirmVariant?:
        | 'destructive'
        | 'default'
        | 'outline'
        | 'secondary'
        | 'ghost'
        | 'link';
    icon?: ReactNode;
}

export function ConfirmationDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    confirmVariant = 'destructive',
    icon,
}: ConfirmationDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    {icon && <div className="mx-auto mb-4">{icon}</div>}
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-4 flex justify-end gap-3">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="min-w-[80px] border-gray-600 bg-gray-700/50 font-medium text-white hover:bg-gray-600 hover:text-white"
                    >
                        {cancelText}
                    </Button>
                    <Button
                        variant={confirmVariant}
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={
                            confirmVariant === 'destructive'
                                ? 'min-w-[80px] bg-red-500/20 font-medium text-red-400 hover:bg-red-500/40 hover:text-white'
                                : 'min-w-[80px] font-medium'
                        }
                    >
                        {confirmText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
