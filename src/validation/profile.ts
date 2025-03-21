import { z } from 'zod';

export const UpdateProfileSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    email: z.string().email('Invalid email address').optional(),
    studentId: z.string().min(1, 'Student ID is required').optional(),
    department: z.string().min(1).optional(),
});

export type UpdateProfileSchemaType = z.infer<typeof UpdateProfileSchema>;

export const ChangePasswordSchema = z
    .object({
        currentPassword: z.string().min(1, 'Current password is required'),
        newPassword: z
            .string()
            .min(8, 'Password must be at least 8 characters'),
        confirmPassword: z.string().min(1, 'Please confirm your password'),
    })
    .refine(data => data.newPassword === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'],
    });

export type ChangePasswordSchemaType = z.infer<typeof ChangePasswordSchema>;
