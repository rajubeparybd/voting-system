import { v4 as uuid } from 'uuid';
import { encode as defaultEncode } from 'next-auth/jwt';

import { PrismaAdapter } from '@auth/prisma-adapter';
import NextAuth, { User } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { db } from './prisma';
import { AuthSchema } from '@/validation/auth';
import { comparePassword } from './bcrypt';
import { Adapter } from 'next-auth/adapters';

const adapter = PrismaAdapter(db) as Adapter;

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter,
    providers: [
        Credentials({
            credentials: {
                studentId: {},
                password: {},
            },
            authorize: async credentials => {
                const validatedCredentials = AuthSchema.parse(credentials);

                const user = await db.user.findFirst({
                    where: {
                        studentId: validatedCredentials.studentId,
                    },
                });

                if (user && user.password) {
                    const isValidPassword = await comparePassword(
                        validatedCredentials.password,
                        user.password
                    );

                    if (!isValidPassword) {
                        throw new Error('Invalid credentials.');
                    }
                }

                if (!user) {
                    throw new Error('Invalid credentials.');
                }

                return user as User;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, account }) {
            if (account?.provider === 'credentials') {
                token.credentials = true;
            }
            return token;
        },
    },
    jwt: {
        encode: async function (params) {
            if (params.token?.credentials) {
                const sessionToken = uuid();

                if (!params.token.sub) {
                    throw new Error('No user ID found in token');
                }

                const createdSession = await adapter?.createSession?.({
                    sessionToken: sessionToken,
                    userId: params.token.sub,
                    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                });

                if (!createdSession) {
                    throw new Error('Failed to create session');
                }

                return sessionToken;
            }
            return defaultEncode(params);
        },
    },
});
