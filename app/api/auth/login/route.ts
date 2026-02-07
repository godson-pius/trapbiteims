import { NextResponse } from 'next/server';
import { verifyCredentials, createSession } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        if (verifyCredentials(email, password)) {
            const response = NextResponse.json({ message: 'Login successful' });
            return await createSession(response);
        }

        return NextResponse.json(
            { error: 'Invalid email or password' },
            { status: 401 }
        );
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
