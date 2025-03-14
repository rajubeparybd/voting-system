import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
    interface User {
        id: string;
        name: string;
        email: string;
        studentId: string;
        role: string[];
    }

    interface Session extends DefaultSession {
        user?: User;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: string;
        name: string;
        email: string;
        studentId: string;
        role: string[];
    }
}
