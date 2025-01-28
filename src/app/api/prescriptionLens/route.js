
import { NextResponse } from 'next/server';
import dbConnect from '@/utlis/mongodb';
import PrescriptionLens from '@/models/prescriptionLens';


export async function GET() {
    try {
        await dbConnect();
        const prescriptionLens = await PrescriptionLens.find().sort({ createdAt: -1 }).limit(10);
        return NextResponse.json({ success: true, data: prescriptionLens });
    } catch (error) {
        console.error('Error fetching prescription lens:', error);
        return NextResponse.json({ success: false, error: `Failed to fetch prescription lens. Error: ${error}` });
    }
}

export async function POST(req) {
    try {
        await dbConnect();
        const body = await req.json();
        console.log('Body:', body);
        const newPrescriptionLens = await PrescriptionLens.create(body);
        return NextResponse.json({ success: true, data: newPrescriptionLens });
    } catch (error) {
        console.error('Error adding Prescription Lens:', error);
        return NextResponse.json({ success: false, error: `Failed to add Prescription Lens. Error: ${error}` });
    }
}

export async function DELETE(req) {
    try {
        await dbConnect();
        const { id } = await req.json();
        const deletedPrescriptionLens = await PrescriptionLens.findOneAndDelete({ id: id });
        if (!deletedPrescriptionLens) {
            return NextResponse.json({ success: false, error: 'Prescription Lens not found' });
        }
        return NextResponse.json({ success: true, data: deletedPrescriptionLens });
    } catch (error) {
        console.error('Error deleting Prescription Lens:', error);
        return NextResponse.json({ success: false, error: `Failed to delete Prescription Lens. Error: ${error}` });
    }
}

export async function PUT(req) {
    try {
        await dbConnect();
        const { id, ...body } = await req.json();

        const updatedPrescriptionLens = await PrescriptionLens.findOneAndUpdate({ id: id }, body, { new: true });
        if (!updatedPrescriptionLens) {
            return NextResponse.json({ success: false, error: 'Prescription Lens not found' });
        }
        return NextResponse.json({ success: true, data: updatedPrescriptionLens });
    } catch (error) {
        console.error('Error updating Prescription Lens:', error);
        return NextResponse.json({ success: false, error: `Failed to update Prescription Lens. Error: ${error}` });
    }
}