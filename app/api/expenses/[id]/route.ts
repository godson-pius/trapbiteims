import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Expense from '@/models/Expense';

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;
        const expense = await Expense.findByIdAndDelete(id);
        if (!expense) {
            return NextResponse.json({ error: 'Expense record not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Expense record deleted successfully' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;
        const body = await request.json();

        const expense = await Expense.findByIdAndUpdate(id, body, { new: true });

        if (!expense) {
            return NextResponse.json({ error: 'Expense record not found' }, { status: 404 });
        }

        return NextResponse.json(expense);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
