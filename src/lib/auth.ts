import { v4 as uuid } from 'uuid';
import { encode as defaultEncode } from 'next-auth/jwt';
import { PrismaAdapter } from '@auth/prisma-adapter';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { db } from './prisma';
import { AuthSchema } from '@/validation/auth';
import { comparePassword } from './bcrypt';
import { Adapter } from 'next-auth/adapters';
import { Role } from '@prisma/client';

declare module 'next-auth' {
    interface User {
        id?: string;
        role: Role[];
        studentId?: string | null;
        name?: string | null;
        email?: string | null;
    }
    interface Session {
        user: {
            id: string;
            role: Role[];
            studentId?: string | null;
            name?: string | null;
            email?: string | null;
        };
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        role?: Role[];
        studentId?: string | null;
    }
}

const adapter = PrismaAdapter(db) as Adapter;

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter,
    session: { strategy: 'jwt' },
    debug: true,
    providers: [
        Credentials({
            credentials: {
                studentId: { type: 'text', label: 'Student ID' },
                password: { type: 'password', label: 'Password' },
            },
            async authorize(credentials) {
                try {
                    const validatedCredentials = AuthSchema.parse(credentials);

                    const user = await db.user.findFirst({
                        where: {
                            studentId: validatedCredentials.studentId,
                        },
                    });

                    if (!user) {
                        throw new Error('Invalid credentials.');
                    }

                    if (!user.password) {
                        throw new Error('Invalid credentials.');
                    }

                    const isValidPassword = await comparePassword(
                        validatedCredentials.password,
                        user.password
                    );

                    if (!isValidPassword) {
                        throw new Error('Invalid credentials.');
                    }

                    return {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        studentId: user.studentId,
                        role: user.role,
                    };
                } catch (error) {
                    console.error('Auth error:', error);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
                token.studentId = user.studentId;
            }
            return token;
        },
        async session({ session, token }) {
            console.log(
                'Session Callback - Session:',
                session,
                'Token:',
                token
            );
            if (session.user) {
                session.user.role = token.role || [];
                session.user.id = token.sub || '';
                session.user.studentId = token.studentId;
            }
            return session;
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
    pages: {
        signIn: '/auth/signin',
        error: '/auth/error',
        signOut: '/auth/signout',
    },
});
