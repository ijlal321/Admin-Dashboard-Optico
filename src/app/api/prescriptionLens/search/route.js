import { NextResponse } from 'next/server';
import dbConnect from '@/utlis/mongodb';
import PrescriptionLens from '@/models/prescriptionLens';

// This handles a GET request to fetch matching results
export async function GET(req) {
    try {
        // Parse the search query from the URL parameters
        const { searchParams } = new URL(req.url);
        const search = searchParams.get('search');

        // Connect to the database
        await dbConnect();

        // Find up to 5 results where the brand name matches the search query (case-insensitive)
        const prescriptionLens = await PrescriptionLens.find(
            { name: { $regex: search, $options: 'i' } }
        )
        .sort({ createdAt: -1 }) // Sort by creation date in descending order
        .limit(5); // Limit the results to 5

        // Return the response as JSON
        return NextResponse.json({ success: true, data: prescriptionLens });
    } catch (error) {
        console.error('Error fetching prescription lens:', error);
        // Return an error response
        return NextResponse.json(
            { success: false, error: `Failed to fetch prescription lens. Error: ${error.message}` },
        );
    }
}

