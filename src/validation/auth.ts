import { z } from 'zod';

const AuthSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

type AuthSchemaType = z.infer<typeof AuthSchema>;

const SignupSchema = AuthSchema.extend({
    name: z.string().min(3),
});

type SignupSchemaType = z.infer<typeof SignupSchema>;

export { AuthSchema, type AuthSchemaType, SignupSchema, type SignupSchemaType };
