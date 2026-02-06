import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Debt from '@/models/Debt';

export async function GET() {
    try {
        await dbConnect();
        const debts = await Debt.find({}).sort({ date: -1 });
        return NextResponse.json(debts);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch debts' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();
        const debt = await Debt.create(body);
        return NextResponse.json(debt, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create debt' }, { status: 500 });
    }
}
