'use server';

import { executeAction } from '@/lib/executeAction';
import { db } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { UpdateProfileSchema } from '@/validation/profile';

export async function updateProfile(formData: FormData) {
    return executeAction({
        actionFn: async () => {
            const session = await auth();
            if (!session?.user?.id) {
                throw new Error('Not authenticated');
            }

            const name = formData.get('name');
            const email = formData.get('email');
            const studentId = formData.get('studentId');
            const department = formData.get('department');

            const validatedData = UpdateProfileSchema.parse({
                name,
                email,
                studentId,
                department,
            });

            // Check if email is already taken by another user
            if (validatedData.email) {
                const existingUserWithEmail = await db.user.findFirst({
                    where: {
                        email: validatedData.email.toLowerCase(),
                        NOT: {
                            id: session.user.id,
                        },
                    },
                });

                if (existingUserWithEmail) {
                    throw new Error('Email already taken');
                }
            }

            // Check if student ID is already taken by another user
            if (validatedData.studentId) {
                const existingUserWithStudentId = await db.user.findFirst({
                    where: {
                        studentId: validatedData.studentId,
                        NOT: {
                            id: session.user.id,
                        },
                    },
                });

                if (existingUserWithStudentId) {
                    throw new Error('Student ID already taken');
                }
            }

            await db.user.update({
                where: {
                    id: session.user.id,
                },
                data: {
                    name: validatedData.name,
                    email: validatedData.email?.toLowerCase(),
                    studentId: validatedData.studentId,
                    department: validatedData.department,
                },
            });
        },
        successMessage: 'Profile updated successfully',
    });
}
