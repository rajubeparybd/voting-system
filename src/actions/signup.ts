import { hashPassword } from '@/lib/bcrypt';
import { executeAction } from '@/lib/executeAction';
import { db } from '@/lib/prisma';
import { SignupSchema } from '@/validation/auth';

const signUp = async (formData: FormData) => {
    return executeAction({
        actionFn: async () => {
            const name = formData.get('name');
            const email = formData.get('email');
            const password = formData.get('password');
            const validatedData = SignupSchema.parse({ name, email, password });
            await db.user.create({
                data: {
                    name: validatedData.name,
                    email: validatedData.email.toLocaleLowerCase(),
                    password: await hashPassword(validatedData.password),
                },
            });
        },
        successMessage: 'Signed up successfully',
    });
};

export { signUp };
