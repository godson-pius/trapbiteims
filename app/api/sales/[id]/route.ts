import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Sale from '@/models/Sale';
import Product from '@/models/Product';

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;
        const sale = await Sale.findByIdAndDelete(id);
        if (!sale) {
            return NextResponse.json({ error: 'Sale record not found' }, { status: 404 });
        }

        // Restore stock when a sale is deleted
        await Product.findByIdAndUpdate(sale.productId, {
            $inc: { stock: sale.quantity }
        });

        return NextResponse.json({ message: 'Sale record deleted and stock restored' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
