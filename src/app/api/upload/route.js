import cloudinary from "@/utlis/cloudinary";
import { NextResponse } from "next/server";

import axios from "axios";

// Create an Axios instance with a higher timeout
const axiosInstance = axios.create({
  timeout: 30000, // Set 30 seconds timeout
});


export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("image");
    const folderName = formData.get("folderName")

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert file into a format Cloudinary accepts
    const fileBuffer = await file.arrayBuffer();
    const base64File = `data:${file.type};base64,${Buffer.from(fileBuffer).toString("base64")}`;

    // Upload to Cloudinary using the configured instance
    const result = await cloudinary.uploader.upload(base64File, {
      folder: folderName,
      format: "webp",
      transformation: [
        { width: 800, crop: "scale" }, // Resize to 800px width
        { quality: "auto" }, // Auto-optimize quality
        { fetch_format: "auto" }, // Deliver as WebP/AVIF if supported
      ],
    });

    return NextResponse.json({ url: result.url });
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
  }
}