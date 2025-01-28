import axios from 'axios';
import imageCompression from 'browser-image-compression';

const compressImage = async (file) => {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  };
  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.error('Failed to compress image:', error);
    return file;
  }
};


const uploadImagesSequentially = async (imagesArray, folderName) => {
  const successfullyUploaded = []; // To track successfully uploaded images

  for (const images of imagesArray) {
    for (const image of images) {
      // Only upload new images (i.e., not existing URLs)
      if (typeof image !== 'string') {

        // Compress the image before uploading
        const compressedImage = await compressImage(image);

        const formData = new FormData();
        formData.append('image', compressedImage);
        formData.append('folderName', folderName);

        try {

          // Send the image to the backend
          const response = await axios.post('/api/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          if (!response.data.error) {
            successfullyUploaded.push(response.data.url); // Save the uploaded image's public_id
          } else {
            throw new Error('Upload failed');
          }
        } catch (error) {
          console.error('Upload failed:', error);

          // Rollback the images uploaded before failure
          await rollbackUploadedImages(successfullyUploaded);

          return { success: false, message: 'One of the uploads failed, removed saved images. Try again...' };
        }
      }
    }
  }


  const updtedImages = [[]];
  let newImageIndex = 0;
  for (const images of imagesArray) {
    for (const image of images) {
      if (typeof image === 'string') {
        updtedImages[updtedImages.length - 1].push(image);
      }
      else {
        updtedImages[updtedImages.length - 1].push(successfullyUploaded[newImageIndex]);
        newImageIndex += 1;
      }
    }
    updtedImages.push([]);
  }
  updtedImages.pop(); // remove the last empty array
  // Return the successfully uploaded images if everything is fine

  return { success: true, uploadedImages: updtedImages };
};

const extractPublicURL = (url) => {
  const parts = url.split('/');
  return parts.slice(-2).join('/').split('.')[0];
}

// Function to rollback already uploaded images
const rollbackUploadedImages = async (uploadedImages) => {
  let unSuccessful = 0;
  for (const imageUrl of uploadedImages) {
    try {
      const publicIdParts = imageUrl.split('/');
      const publicId = publicIdParts.slice(-2).join('/').split('.')[0];
      const res = await axios.post('/api/upload/delete', { publicId });
      if (!res.data.success) {
        throw new Error(`Failed to delete image. Reason: ${res.data.error}`);
      }
      else {
        console.log(`Image with public_id ${publicId} has been deleted.`);
      }
    } catch (error) {
      console.error('Failed to rollback image deletion:', error);
      unSuccessful += 1;
    }
  }
  return unSuccessful;
};


const deleteImagesArray = async (images) => {
  const toBeDeleted = images.flat();
  let unSuccessful = 0;
  for (const URL of toBeDeleted) {
    if (typeof URL !== 'string') {
      continue;
    }
    try {
      const publicId = extractPublicURL(URL);
      const res = await axios.post('/api/upload/delete', { publicId });
      if (!res.data.success) {
        throw new Error(`Failed to delete image. Reason: ${res.data.error}`);
      }
      else {
        console.log(`Image with public_id ${publicId} has been deleted.`);
      }
    } catch (error) {
      console.error('Failed to delete image:', error);
      unSuccessful += 1;
    }
  }
  return unSuccessful;
};

const cleanUpOldImages = async (product, newImages) => {
  try {

    // we delete images that were deleted when new product was updated and new images were added
    const imagesToDelete = [];
    const newImagesFlat = newImages.flat();

    for (const variant of product.variants) {
      for (const image of variant.images) {
        if (typeof image === 'string' && !newImagesFlat.includes(image)) {
          imagesToDelete.push(image);
        }
      }
    }
    const unSuccessful = await rollbackUploadedImages(imagesToDelete);
    return { total: imagesToDelete.length, unSuccessful };
  } catch (error) {
    console.error('Failed to clean up old images:', error);
    return { unSuccessful: 100 };
  }
}

const cleanUpNewImages = async (product, newImages) => {
  try {
    // we delete new images that were uploaded, but data about them could not be stored, 
    // so we delete newly stored images which are not in db by any means

    const imagesToDelete = [];
    const oldImagesFlat = product.variants.map(variant => variant.images).flat();

    for (const image of newImages.flat()) {
      if (typeof image === 'string' && !oldImagesFlat.includes(image)) {
        imagesToDelete.push(image);
      }
    }

    const unSuccessful = await rollbackUploadedImages(imagesToDelete);
    return { total: imagesToDelete.length, unSuccessful };
  } catch (error) {
    console.error('Failed to clean up new images:', error);
    return { unSuccessful: 100 };
  }
}

const deleteVariantsImages = async (variants) => {
  let unSuccessful = 0;
  let total = 0;
  for (const variant of variants) {
    try {
      total += variant.images.length;
      unSuccessful += await rollbackUploadedImages(variant.images);
    } catch (error) {
      console.error('Failed to delete variant images:', error);
    }
  }
  return { total, unSuccessful };
}


const uploadImagesArray = async (imagesArr, folderName) => {
  const successfullyUploaded = [];

  // looping images
  for (const image of imagesArr) {
    if (typeof image !== 'string') {
      const formData = new FormData();
      formData.append('image', image);
      formData.append('folderName', folderName);

      try {
        const response = await axios.post('/api/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (!response.data.error) {
          successfullyUploaded.push(response.data.url);
        } else {
          throw new Error('Upload failed');
        }
      } catch (error) {
        const unSuccessful = await rollbackUploadedImages(successfullyUploaded);
        if (unSuccessful == 0) {
          return { success: false, message: 'One of the uploads failed, clean rollback completed. No garbage ' };
        }
        else {
          return { success: false, message: 'One of the uploads failed, clean rollback failed. Garbage present ' };
        }
      }
    }
  }


  const updatedImages = [];
  for (const image of imagesArr) {
    if (typeof image === 'string') {
      updatedImages.push(image);
    }
    else {
      updatedImages.push(successfullyUploaded.shift());
    }
  }
  return { success: true, uploadedImages: updatedImages };
};

export { uploadImagesSequentially, deleteVariantsImages, cleanUpNewImages, cleanUpOldImages, deleteImagesArray, uploadImagesArray };
