
import { NextResponse } from 'next/server';
import dbConnect from '@/utlis/mongodb';
import Frame from '@/models/frame';

export async function GET(req, context) {
    const { params } = context; // Access the params object from context
    const { id } = await params;

  await dbConnect();

  try {
    const frame = await Frame.findOne({ id });
    if (!frame) {
      return NextResponse.json({ success: false, error: 'Frame not found' });
    }
    return NextResponse.json({ success: true, data: frame });
  } catch (error) {
    console.error('Error fetching frame:', error);
    return NextResponse.json({ success: false, error: error.message });
  }
}


export async function PUT(req, context) {
    const { params } = context;
    const { id } = await params;
    const data = await req.json();

    await dbConnect();

    try {
        const updatedFrame = await Frame.findOneAndUpdate({ id }, data, { new: true });
        if (!updatedFrame) {
            return NextResponse.json({ success: false, error: 'Frame not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: updatedFrame });
    } catch (error) {
        console.error('Error updating Frame:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}