import { NextResponse } from 'next/server';
import dbConnect from '@/utlis/mongodb';
import ContactLens from '@/models/contactLens';

// This handles a GET request to fetch matching results
export async function GET(req) {
    try {
        // Parse the search query from the URL parameters
        const { searchParams } = new URL(req.url);
        const search = searchParams.get('search');

        // Connect to the database
        await dbConnect();

        // Find up to 5 results where the brand name matches the search query (case-insensitive)
        const contactLens = await ContactLens.find(
            { name: { $regex: search, $options: 'i' } }
        )
        .sort({ createdAt: -1 }) // Sort by creation date in descending order
        .limit(5); // Limit the results to 5

        // Return the response as JSON
        return NextResponse.json({ success: true, data: contactLens });
    } catch (error) {
        console.error('Error fetching Contact Lens:', error);
        // Return an error response
        return NextResponse.json(
            { success: false, error: `Failed to fetch Contact Lens. Error: ${error.message}` },
        );
    }
}

