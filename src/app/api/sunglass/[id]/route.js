import { NextResponse } from 'next/server';
import dbConnect from '@/utlis/mongodb';
import Sunglass from '@/models/sunglass';


export async function GET(req, context) {
    const { params } = context; // Access the params object from context
    const { id } = await params;

  await dbConnect();

  try {
    const sunglass = await Sunglass.findOne({ id });
    if (!sunglass) {
      return NextResponse.json({ success: false, error: 'Sunglass not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: sunglass });
  } catch (error) {
    console.error('Error fetching sunglass:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}


export async function PUT(req, context) {
    const { params } = context;
    const { id } = await params;
    const data = await req.json();

    await dbConnect();

    try {
        const updatedSunglass = await Sunglass.findOneAndUpdate({ id }, data, { new: true });
        if (!updatedSunglass) {
            return NextResponse.json({ success: false, error: 'Sunglass not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: updatedSunglass });
    } catch (error) {
        console.error('Error updating Sunglass:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}