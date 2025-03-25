'use server';

import { executeAction } from '@/lib/executeAction';
import { db } from '@/lib/prisma';
import { ChangePasswordSchema } from '@/validation/profile';
import { auth } from '@/lib/auth';
import { comparePassword, hashPassword } from '@/lib/bcrypt';

export async function changePassword(formData: FormData) {
    return executeAction({
        actionFn: async () => {
            const session = await auth();
            if (!session?.user?.id) {
                throw new Error('Not authenticated');
            }

            const currentPassword = formData.get('currentPassword');
            const newPassword = formData.get('newPassword');
            const confirmPassword = formData.get('confirmPassword');

            const validatedData = ChangePasswordSchema.parse({
                currentPassword,
                newPassword,
                confirmPassword,
            });

            const user = await db.user.findUnique({
                where: {
                    id: session.user.id,
                },
            });

            if (!user?.password) {
                throw new Error('No password set for this account');
            }

            const isValidPassword = await comparePassword(
                validatedData.currentPassword,
                user.password
            );

            if (!isValidPassword) {
                throw new Error('Current password is incorrect');
            }

            await db.user.update({
                where: {
                    id: session.user.id,
                },
                data: {
                    password: await hashPassword(validatedData.newPassword),
                },
            });
        },
        successMessage: 'Password changed successfully',
    });
}
