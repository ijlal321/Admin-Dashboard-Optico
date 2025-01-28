const cloudinary = require('cloudinary').v2;

const cloudinaryUrl = process.env.CLOUDINARY_URL;

if (cloudinaryUrl) {
    cloudinary.config({
        cloudinary_url: cloudinaryUrl,
    });
} else {
    console.error('Cloudinary URL is not set in environment variables');
}

module.exports = cloudinary;