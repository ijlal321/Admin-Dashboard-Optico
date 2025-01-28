import { NextResponse } from 'next/server';
import cloudinary from '@/utlis/cloudinary';

export async function POST(req) {
  const { publicId } = await req.json();  // Get the image URL from the request body

  try {
    console.log('Deleting image with public_id:', publicId);
    // Delete image from Cloudinary
    await cloudinary.uploader.destroy(publicId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json({ success: false, error: error });
  }
}
