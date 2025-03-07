import { signIn } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { FaGithub } from 'react-icons/fa';

const GithubSignIn = () => {
    return (
        <form
            action={async () => {
                'use server';
                await signIn('github');
            }}
        >
            <Button className="w-full" variant="outline">
                <FaGithub className="mr-2" />
                Continue with GitHub
            </Button>
        </form>
    );
};

export { GithubSignIn };
