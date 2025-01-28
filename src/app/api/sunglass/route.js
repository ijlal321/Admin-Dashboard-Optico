
import { NextResponse } from 'next/server';
import dbConnect from '@/utlis/mongodb';
import Sunglass from '@/models/sunglass';

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const sunglass = await Sunglass.create(body);
    return NextResponse.json({ success: true, data: sunglass });
  } catch (error) {
    console.error('Error creating sunglass:', error);
    return NextResponse.json({ success: false, error: error.message });
  }
}


export async function GET() {
  try {
    await dbConnect();
    const sunglass = await Sunglass.find().sort({ createdAt: -1 }).limit(10);
    return NextResponse.json({ success: true, data: sunglass });
  } catch (error) {
    console.error('Error fetching sunglass:', error);
    return NextResponse.json({ success: false, error: error.message });
  }
}

export async function DELETE(req) {
  try {
    await dbConnect();
    const { id } = await req.json();
    const deletedSunglass = await Sunglass.findOneAndDelete({ id });
    if (!deletedSunglass) {
      return NextResponse.json({ success: false, error: 'Sunglass not found' });
    }
    return NextResponse.json({ success: true, data: deletedSunglass });
  } catch (error) {
    console.error('Error deleting sunglass:', error);
    return NextResponse.json({ success: false, error: error.message });
  }
}