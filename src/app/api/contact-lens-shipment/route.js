import { NextResponse } from 'next/server';
import dbConnect from '@/utlis/mongodb';
import ContactLensShipment from '@/models/contactLensShipment';

export async function GET() {
    try {
        await dbConnect();
        const shipments = await ContactLensShipment.find().sort({ createdAt: -1 }).limit(10);
        return NextResponse.json({ success: true, data: shipments });
    } catch (error) {
        console.error('Error fetching shipments:', error);
        return NextResponse.json({ success: false, error: `Failed to fetch shipments. Error: ${error}` });
    }
}

export async function POST(req) {
    try {
        await dbConnect();
        const body = await req.json();
        const newShipment = await ContactLensShipment.create(body);
        return NextResponse.json({ success: true, data: newShipment });
    } catch (error) {
        console.error('Error adding shipment:', error);
        return NextResponse.json({ success: false, error: `Failed to add shipment. Error: ${error}` });
    }
}

export async function DELETE(req) {
    try {
        await dbConnect();
        const { _id } = await req.json();
        const deletedShipment = await ContactLensShipment.findByIdAndDelete(_id);
        if (!deletedShipment) {
            return NextResponse.json({ success: false, error: 'Shipment not found' });
        }
        return NextResponse.json({ success: true, data: deletedShipment });
    } catch (error) {
        console.error('Error deleting shipment:', error);
        return NextResponse.json({ success: false, error: `Failed to delete shipment. Error: ${error}` });
    }
}

export async function PUT(req) {
    try {
        await dbConnect();
        const { _id, ...body } = await req.json();

        const updatedShipment = await ContactLensShipment.findByIdAndUpdate(_id, body, { new: true });
        if (!updatedShipment) {
            return NextResponse.json({ success: false, error: 'Shipment not found' });
        }
        return NextResponse.json({ success: true, data: updatedShipment });
    } catch (error) {
        console.error('Error updating shipment:', error);
        return NextResponse.json({ success: false, error: `Failed to update shipment. Error: ${error}` });
    }
}