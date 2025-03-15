import { Role } from '@prisma/client';
import 'next-auth';

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            name?: string | null;
            email?: string | null;
            role?: Role;
            department?: string | null;
            image?: string | null;
        };
    }

    interface User {
        id: string;
        name?: string | null;
        email?: string | null;
        studentId?: string | null;
        department?: string | null;
        role: Role[];
        image?: string | null;
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
        department?: string | null;
        role: Role[];
        image?: string | null;
    }
}
