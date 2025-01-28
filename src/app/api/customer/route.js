
import { NextResponse } from 'next/server';
import dbConnect from '@/utlis/mongodb';
import Customer from '@/models/customer';

export async function GET() {
    try {
        await dbConnect();
        const customers = await Customer.find().sort({ createdAt: -1 }).limit(10); // last 10 customers
        return NextResponse.json({ success: true, data: customers });
    } catch (error) {
        console.error('Error fetching customers:', error);
        return NextResponse.json({ success: false, error: `Failed to fetch customers. Error: ${error}` });
    }
}

export async function POST(req) {
    try {
        await dbConnect();
        const body = await req.json();
        console.log('Body:', body);
        const newCustomer = await Customer.create(body);
        return NextResponse.json({ success: true, data: newCustomer });
    } catch (error) {
        return NextResponse.json({ success: false, error: `Failed to add customer. Error: ${error}` });
    }
}

export async function DELETE(req) {
    try {
        await dbConnect();
        const { id } = await req.json();
        const deletedCustomer = await Customer.findOneAndDelete({ id: id });
        if (!deletedCustomer) {
            return NextResponse.json({ success: false, error: 'Customer not found' });
        }
        return NextResponse.json({ success: true, data: deletedCustomer });
    } catch (error) {
        console.error('Error deleting customer:', error);
        return NextResponse.json({ success: false, error: `Failed to delete customer. Error: ${error}` });
    }
}

export async function PUT(req) {
    try {
        await dbConnect();
        const { id, ...body } = await req.json();

        const updatedCustomer = await Customer.findOneAndUpdate({ id: id }, body, { new: true });
        if (!updatedCustomer) {
            return NextResponse.json({ success: false, error: 'Customer not found' });
        }
        return NextResponse.json({ success: true, data: updatedCustomer });
    } catch (error) {
        console.error('Error updating customer:', error);
        return NextResponse.json({ success: false, error: `Failed to update customer. Error: ${error}` });
    }
}
