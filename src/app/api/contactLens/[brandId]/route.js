import { NextResponse } from 'next/server';
import dbConnect from '@/utlis/mongodb';
import ContactLens from '@/models/contactLens';


export async function GET(req, { params }) {
    try {
        const { brandId } = await params; // Extract the brand brandId from the route parameter

        // Connect to the database
        await dbConnect();

        // Find the brand by its brandId
        const brand = await ContactLens.findOne({id: brandId});

        if (!brand) {
            return NextResponse.json({ success: false, error: 'Contact Lens not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: brand });
    } catch (error) {
        console.error('Error fetching Contact Lens by ID:', error);
        return NextResponse.json(
            { success: false, error: `Failed to fetch brand. Error: ${error.message}` },
            { status: 500 }
        );
    }
}