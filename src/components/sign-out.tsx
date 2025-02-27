'use client';
import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';

const SignOut = () => {
    const handleSignOut = async () => {
        await signOut();
    };

    return (
        <div className="flex justify-center">
            <Button
                variant="outline"
                onClick={handleSignOut}
                className="hover:scale-105 hover:shadow-lg"
            >
                <LogOut className="mr-1 h-4 w-4" />
                Sign Out
            </Button>
        </div>
    );
};

export { SignOut };
