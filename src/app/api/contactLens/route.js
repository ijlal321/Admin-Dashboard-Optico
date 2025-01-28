
import { NextResponse } from 'next/server';
import dbConnect from '@/utlis/mongodb';
import ContactLens from '@/models/contactLens';


export async function GET() {
    try {
        await dbConnect();
        const contactLens = await ContactLens.find().sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: contactLens });
    } catch (error) {
        console.error('Error fetching Contact Lens:', error);
        return NextResponse.json({ success: false, error: `Failed to fetch Contact Lens. Error: ${error}` });
    }
}

export async function POST(req) {
    try {
        await dbConnect();
        const body = await req.json();
        console.log('Body:', body);
        const newContactLens = await ContactLens.create(body);
        return NextResponse.json({ success: true, data: newContactLens });
    } catch (error) {
        console.error('Error adding Contact Lens:', error);
        return NextResponse.json({ success: false, error: `Failed to add Contact Lens. Error: ${error}` });
    }
}

export async function DELETE(req) {
    try {
        await dbConnect();
        const { id } = await req.json();
        const deletedContactLens = await ContactLens.findOneAndDelete({ id: id });
        if (!deletedContactLens) {
            return NextResponse.json({ success: false, error: 'Contact Lens not found' });
        }
        return NextResponse.json({ success: true, data: deletedContactLens });
    } catch (error) {
        console.error('Error deleting Contact Lens:', error);
        return NextResponse.json({ success: false, error: `Failed to delete Contact Lens. Error: ${error}` });
    }
}

export async function PUT(req) {
    try {
        await dbConnect();
        const { id, ...body } = await req.json();

        const updatedContactLens = await ContactLens.findOneAndUpdate({ id: id }, body, { new: true });
        if (!updatedContactLens) {
            return NextResponse.json({ success: false, error: 'Contact Lens not found' });
        }
        return NextResponse.json({ success: true, data: updatedContactLens });
    } catch (error) {
        console.error('Error updating Contact Lens:', error);
        return NextResponse.json({ success: false, error: `Failed to update Contact Lens. Error: ${error}` });
    }
}