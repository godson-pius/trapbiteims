import { NextRequest, NextResponse } from 'next/server';

const AUTH_COOKIE = 'trapbite_ims_session';
const ADMIN_EMAIL = 'admin@trapbiteims.com';
const ADMIN_PASSWORD = 'trapbiteims100%';

export async function createSession(response: NextResponse) {
    response.cookies.set(AUTH_COOKIE, 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/',
    });
    return response;
}

export async function deleteSession(response: NextResponse) {
    response.cookies.delete(AUTH_COOKIE);
    return response;
}

export function isAuthenticated(request: NextRequest) {
    const session = request.cookies.get(AUTH_COOKIE);
    return session?.value === 'authenticated';
}

export function verifyCredentials(email: string, password: string) {
    return email === ADMIN_EMAIL && password === ADMIN_PASSWORD;
}
