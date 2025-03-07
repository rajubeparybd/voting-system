import { z } from 'zod';

const AuthSchema = z.object({
    password: z.string().min(1),
    studentId: z.string().min(1),
});

type AuthSchemaType = z.infer<typeof AuthSchema>;

const SignupSchema = AuthSchema.extend({
    name: z.string().min(3),
    email: z.string().email(),
});

type SignupSchemaType = z.infer<typeof SignupSchema>;

export { AuthSchema, type AuthSchemaType, SignupSchema, type SignupSchemaType };
