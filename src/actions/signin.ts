import { signIn as PrismaSignIn } from '@/lib/auth';
import { executeAction } from '@/lib/executeAction';

const signIn = async (formData: FormData) => {
    return executeAction({
        actionFn: async () => {
            const email = formData.get('email')?.toString();
            const password = formData.get('password')?.toString();
            if (!email || !password) {
                throw new Error('Email and password are required.');
            }
            return await PrismaSignIn('credentials', { email, password });
        },
        successMessage: 'Signed in successfully',
    });
};

export { signIn };
