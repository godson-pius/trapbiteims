import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Sale from '@/models/Sale';
import Product from '@/models/Product';

export async function GET() {
    try {
        await connectDB();
        const sales = await Sale.find({}).sort({ date: -1 });
        return NextResponse.json(sales);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await connectDB();
        const body = await request.json();

        // When a sale is recorded, we should also update the product stock
        const sale = await Sale.create(body);

        await Product.findByIdAndUpdate(body.productId, {
            $inc: { stock: -body.quantity }
        });

        return NextResponse.json(sale, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
