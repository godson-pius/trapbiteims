import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Debt from '@/models/Debt';

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;
        const body = await req.json();

        const debt = await Debt.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });

        if (!debt) {
            return NextResponse.json({ error: 'Debt not found' }, { status: 404 });
        }

        return NextResponse.json(debt);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update debt' }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;
        const debt = await Debt.findByIdAndDelete(id);

        if (!debt) {
            return NextResponse.json({ error: 'Debt not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Debt deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete debt' }, { status: 500 });
    }
}
