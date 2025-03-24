import { signIn as PrismaSignIn } from '@/lib/auth';
import { executeAction } from '@/lib/executeAction';

const signIn = async (formData: FormData) => {
    return executeAction({
        actionFn: async () => {
            try {
                const studentId = formData.get('studentId')?.toString();
                const password = formData.get('password')?.toString();

                if (!studentId || !password) {
                    throw new Error('Student ID and password are required.');
                }

                const result = await PrismaSignIn('credentials', {
                    studentId,
                    password,
                    redirect: false,
                });

                if (!result?.ok) {
                    throw new Error(result?.error || 'Authentication failed');
                }

                return result;
            } catch (error) {
                console.error('Signin action error:', error);
                throw error;
            }
        },
        successMessage: 'Signed in successfully',
    });
};

export { signIn };
