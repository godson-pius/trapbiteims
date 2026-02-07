import { NextResponse } from 'next/server';
import { deleteSession } from '@/lib/auth';

export async function POST() {
    const response = NextResponse.json({ message: 'Logged out successfully' });
    return await deleteSession(response);
}
