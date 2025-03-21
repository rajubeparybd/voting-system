import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { Role } from '@prisma/client';

interface CustomToken {
    role?: Role[];
    name?: string;
    email?: string;
    department?: string | null;
    sub?: string;
    iat?: number;
    exp?: number;
    jti?: string;
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Get the token using next-auth
    const token = (await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
    })) as CustomToken | null;

    // Define protected routes
    const adminRoutes = [
        '/admin',
        '/admin/dashboard',
        '/admin/voters',
        '/admin/candidates',
    ];
    const userRoutes = ['/user/dashboard', '/user/vote', '/user/profile'];

    // Check if the current path is an admin route
    const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));
    // Check if the current path is a user route
    const isUserRoute = userRoutes.some(route => pathname.startsWith(route));

    // If no token and trying to access protected route
    if (!token && (isAdminRoute || isUserRoute)) {
        return NextResponse.redirect(new URL('/auth/signin', request.url));
    }

    // If token exists but trying to access admin route without admin role
    if (token && isAdminRoute && !token.role?.includes(Role.ADMIN)) {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    // If token exists but trying to access user route without user role
    if (token && isUserRoute && !token.role?.includes(Role.USER)) {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
    matcher: ['/admin/:path*', '/user/:path*'],
};
