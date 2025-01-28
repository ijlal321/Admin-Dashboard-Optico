import { NextResponse } from 'next/server';
import dbConnect from '@/utlis/mongodb';
import Customer from '@/models/customer';

// This handles a POST request to search for customers by name and phone
export async function POST(req) {
    try {
        // Parse the request body to get the search parameters
        const { name, phone } = await req.json();

        // Connect to the database
        await dbConnect();

        // Find up to 5 results where the customer name and phone match the search parameters (case-insensitive)
        const customers = await Customer.find(
            {
                name: { $regex: name, $options: 'i' },
                phone: { $regex: phone, $options: 'i' }
            }
        )
        .sort({ createdAt: -1 }) // Sort by creation date in descending order
        .limit(5); // Limit the results to 5

        // Return the response as JSON
        return NextResponse.json({ success: true, data: customers });
    } catch (error) {
        console.error('Error searching for customers:', error);
        // Return an error response
        return NextResponse.json(
            { success: false, error: `Failed to search for customers. Error: ${error.message}` },
        );
    }
}
