'use server';

import { hashPassword } from '@/lib/bcrypt';
import { executeAction } from '@/lib/executeAction';
import { db } from '@/lib/prisma';
import { SignupSchema } from '@/validation/auth';

const signUp = async (formData: FormData) => {
    return executeAction({
        actionFn: async () => {
            const name = formData.get('name');
            const studentId = formData.get('studentId');
            const email = formData.get('email');
            const password = formData.get('password');
            const validatedData = SignupSchema.parse({
                name,
                studentId,
                email,
                password,
            });

            const existingUser = await db.user.findFirst({
                where: {
                    OR: [
                        { email: validatedData.email.toLowerCase() },
                        { studentId: validatedData.studentId },
                    ],
                },
            });

            if (existingUser) {
                throw new Error(
                    existingUser.email === validatedData.email.toLowerCase()
                        ? 'Email already exists'
                        : 'Student ID already exists'
                );
            }

            await db.user.create({
                data: {
                    name: validatedData.name,
                    email: validatedData.email.toLowerCase(),
                    studentId: validatedData.studentId,
                    password: await hashPassword(validatedData.password),
                    role: ['USER'],
                },
            });
        },
        successMessage: 'Signed up successfully',
    });
};

export { signUp };
