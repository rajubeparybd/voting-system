import { z } from 'zod';

const AuthSchema = z.object({
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(
            /[^A-Za-z0-9]/,
            'Password must contain at least one special character'
        ),
    studentId: z.string().min(1),
});

type AuthSchemaType = z.infer<typeof AuthSchema>;

const SignupSchema = AuthSchema.extend({
    name: z.string().min(3),
    email: z.string().email(),
    department: z.string().min(1),
});

type SignupSchemaType = z.infer<typeof SignupSchema>;

export { AuthSchema, type AuthSchemaType, SignupSchema, type SignupSchemaType };
