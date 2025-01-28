import { NextResponse } from 'next/server';
import dbConnect from '@/utlis/mongodb';
import Order from '@/models/order';


export async function GET(req, { params }) {
    const { id } = await params; // Capture the dynamic segment (e.g., /api/user/123)
    try {
        await dbConnect();
        const order = await Order.findOne({ id });
        if (!order) {
            return NextResponse.json({ success: false, error: 'Order not found' });
        }
        return NextResponse.json({ success: true, data: order });
    }
    catch (error) {
        console.error('Error fetching order:', error);
        return NextResponse.json({ success: false, error: error.message });
    }
}