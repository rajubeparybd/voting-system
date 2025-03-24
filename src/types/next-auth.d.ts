import { Role } from '@prisma/client';
import 'next-auth';

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            name?: string | null;
            email?: string | null;
            role?: Role;
        };
    }

    interface User {
        id: string;
        name?: string | null;
        email?: string | null;
        studentId?: string | null;
        role: Role[];
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        role?: Role;
    }
}

declare module 'next-auth/adapters' {
    interface AdapterUser {
        id: string;
        name?: string | null;
        email?: string | null;
        studentId?: string | null;
        role: Role[];
    }
}
