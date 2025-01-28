import { NextResponse } from 'next/server';
import dbConnect from '@/utlis/mongodb';
import Customer from '@/models/customer';

export async function GET(req, { params }) {
    try {
        const { customerId } = await params; // Extract the customerId from the route parameter

        // Connect to the database
        await dbConnect();

        // Find the customer by its customerId
        const customer = await Customer.findOne({ id: customerId });

        if (!customer) {
            return NextResponse.json({ success: false, error: 'Customer not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: customer });
    } catch (error) {
        console.error('Error fetching customer by ID:', error);
        return NextResponse.json(
            { success: false, error: `Failed to fetch customer. Error: ${error.message}` },
            { status: 500 }
        );
    }
}
