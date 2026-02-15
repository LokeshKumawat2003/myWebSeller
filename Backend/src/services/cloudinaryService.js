const cloudinary = require('cloudinary').v2;

// Upload image to Cloudinary
exports.uploadImage = async (filePath, folder = 'clothing_store') => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      resource_type: 'auto',
    });
    return result.secure_url;
  } catch (err) {
    throw new Error(`Image upload failed: ${err.message}`);
  }
};

// Upload multiple images
exports.uploadMultipleImages = async (filePaths, folder = 'clothing_store') => {
  try {
    const uploadPromises = filePaths.map(filePath =>
      cloudinary.uploader.upload(filePath, {
        folder: folder,
        resource_type: 'auto',
      })
    );
    const results = await Promise.all(uploadPromises);
    return results.map(result => result.secure_url);
  } catch (err) {
    throw new Error(`Multiple image upload failed: ${err.message}`);
  }
};

// Delete image from Cloudinary
exports.deleteImage = async (imageUrl) => {
  try {
    // Extract public_id from URL
    const urlParts = imageUrl.split('/');
    const fileWithExtension = urlParts[urlParts.length - 1];
    const publicId = `clothing_store/${fileWithExtension.split('.')[0]}`;

    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (err) {
    console.error(`Image deletion failed: ${err.message}`);
    return false;
  }
};
