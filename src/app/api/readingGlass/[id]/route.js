
import { NextResponse } from 'next/server';
import dbConnect from '@/utlis/mongodb';
import ReadingGlass from '@/models/readingGlass';

export async function GET(req, context) {
    const { params } = context; // Access the params object from context
    const { id } = await params;

  await dbConnect();

  try {
    const readingGlass = await ReadingGlass.findOne({ id });
    if (!readingGlass) {
      return NextResponse.json({ success: false, error: 'Reading Glass not found' });
    }
    return NextResponse.json({ success: true, data: readingGlass });
  } catch (error) {
    console.error('Error fetching readingGlass:', error);
    return NextResponse.json({ success: false, error: error.message });
  }
}


export async function PUT(req, context) {
    const { params } = context;
    const { id } = await params;
    const data = await req.json();

    await dbConnect();

    try {
        const updatedReadingGlass = await ReadingGlass.findOneAndUpdate({ id }, data, { new: true });
        if (!updatedReadingGlass) {
            return NextResponse.json({ success: false, error: 'Reading Glass not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: updatedReadingGlass });
    } catch (error) {
        console.error('Error updating readingGlass:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}