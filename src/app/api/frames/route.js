
import { NextResponse } from 'next/server';
import dbConnect from '@/utlis/mongodb';
import Frame from '@/models/frame';

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const frame = await Frame.create(body);
    return NextResponse.json({ success: true, data: frame });
  } catch (error) {
    console.error('Error creating frame:', error);
    return NextResponse.json({ success: false, error: error.message });
  }
}



export async function GET() {
  try {
    await dbConnect();
    const frame = await Frame.find().sort({ createdAt: -1 }).limit(10);
    return NextResponse.json({ success: true, data: frame });
  } catch (error) {
    console.error('Error fetching frame:', error);
    return NextResponse.json({ success: false, error: error.message });
  }
}

export async function DELETE(req) {
  try {
    await dbConnect();
    const { id } = await req.json();
    const deletedFrame = await Frame.findOneAndDelete({ id });
    if (!deletedFrame) {
      return NextResponse.json({ success: false, error: 'Frame not found' });
    }
    return NextResponse.json({ success: true, data: deletedFrame });
  } catch (error) {
    console.error('Error deleting frame:', error);
    return NextResponse.json({ success: false, error: error.message });
  }
}