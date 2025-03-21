'use server';

import { hashPassword } from '@/lib/bcrypt';
import { executeAction } from '@/lib/executeAction';
import { db } from '@/lib/prisma';
import { SignupSchema } from '@/validation/auth';
import { Role } from '@prisma/client';

const signUp = async (formData: FormData) => {
    return executeAction({
        actionFn: async () => {
            const name = formData.get('name');
            const studentId = formData.get('studentId');
            const email = formData.get('email');
            const password = formData.get('password');
            const department = formData.get('department');
            const validatedData = SignupSchema.parse({
                name,
                studentId,
                email,
                password,
                department,
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

            try {
                const userData = {
                    name: validatedData.name,
                    email: validatedData.email.toLowerCase(),
                    studentId: validatedData.studentId,
                    department: validatedData.department,
                    password: await hashPassword(validatedData.password),
                    role: ['USER'] as Role[],
                };

                console.log('Creating user with data:', {
                    ...userData,
                    password: '***',
                });

                const createdUser = await db.user.create({
                    data: userData,
                });

                console.log('User created successfully:', {
                    id: createdUser.id,
                    name: createdUser.name,
                    email: createdUser.email,
                    department: createdUser.department,
                });
            } catch (error) {
                throw error;
            }
        },
        successMessage: 'Signed up successfully',
    });
};

export { signUp };
