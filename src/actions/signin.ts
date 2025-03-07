import { signIn as PrismaSignIn } from '@/lib/auth';
import { executeAction } from '@/lib/executeAction';

const signIn = async (formData: FormData) => {
    return executeAction({
        actionFn: async () => {
            const studentId = formData.get('studentId')?.toString();
            const password = formData.get('password')?.toString();
            if (!studentId || !password) {
                throw new Error('Student ID and password are required.');
            }
            return await PrismaSignIn('credentials', { studentId, password });
        },
        successMessage: 'Signed in successfully',
    });
};

export { signIn };
