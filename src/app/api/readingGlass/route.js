
import { NextResponse } from 'next/server';
import dbConnect from '@/utlis/mongodb';
import ReadingGlass from '@/models/readingGlass';

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const readingGlass = await ReadingGlass.create(body);
    return NextResponse.json({ success: true, data: readingGlass });
  } catch (error) {
    console.error('Error creating readingGlass:', error);
    return NextResponse.json({ success: false, error: error.message });
  }
}


export async function GET() {
  try {
    await dbConnect();
    const readingGlasses = await ReadingGlass.find().sort({ createdAt: -1 }).limit(10);
    return NextResponse.json({ success: true, data: readingGlasses });
  } catch (error) {
    console.error('Error fetching readingGlasses:', error);
    return NextResponse.json({ success: false, error: error.message });
  }
}

export async function DELETE(req) {
  try {
    await dbConnect();
    const { _id } = await req.json();
    const deletedReadingGlass = await ReadingGlass.findByIdAndDelete(_id);
    if (!deletedReadingGlass) {
      return NextResponse.json({ success: false, error: 'ReadingGlass not found' });
    }
    return NextResponse.json({ success: true, data: deletedReadingGlass });
  } catch (error) {
    console.error('Error deleting readingGlass:', error);
    return NextResponse.json({ success: false, error: error.message });
  }
}