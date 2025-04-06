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

    // Skip middleware for auth-related routes and static files
    if (
        pathname.startsWith('/auth') ||
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api/auth')
    ) {
        return NextResponse.next();
    }

    // Get the token using next-auth
    const token = (await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
    })) as CustomToken | null;

    // Define protected routes and their required roles
    const protectedRoutes = [
        { path: '/admin', role: Role.ADMIN },
        { path: '/user', role: Role.USER },
    ];

    // Find matching protected route
    const matchedRoute = protectedRoutes.find(route =>
        pathname.startsWith(route.path)
    );

    // If it's a protected route
    if (matchedRoute) {
        // No token - redirect to sign in
        if (!token) {
            const signInUrl = new URL('/auth/signin', request.url);
            signInUrl.searchParams.set('callbackUrl', pathname);
            return NextResponse.redirect(signInUrl);
        }

        // Check if user has required role
        const hasRequiredRole = token.role?.includes(matchedRoute.role);
        if (!hasRequiredRole) {
            return NextResponse.redirect(new URL('/unauthorized', request.url));
        }
    }

    return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!_next/static|_next/image|favicon.ico|public/).*)',
    ],
};
