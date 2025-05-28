const fs = require("fs");
const { v2: cloudinaryV2 } = require("cloudinary");
const cloudinary = require("../configs/cloudinary.config");
const CloudinaryStorage = require("multer-storage-cloudinary").CloudinaryStorage || require("multer-storage-cloudinary").default;

// Cloudinary storage configuration for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

// Upload a file directly using Cloudinary API (optional utility function)
async function uploadFile(localFilePath, folder = "uploads") {
  try {
    const result = await cloudinaryV2.uploader.upload(localFilePath, { folder });
    return result;
  } catch (err) {
    // Enrich error
    const msg = err.message || JSON.stringify(err);
    throw new Error(`Cloudinary upload failed: ${msg}`);
  } finally {
    // Always attempt to remove the temp file
    fs.unlink(localFilePath, unlinkErr => {
      if (unlinkErr) {
        console.error("Failed to remove temp file:", unlinkErr);
      }
    });
  }
}

// Delete a file from Cloudinary by public_id
async function deleteFile(publicId) {
  try {
    const result = await cloudinaryV2.uploader.destroy(publicId);
    return result;
  } catch (err) {
    throw new Error(`Delete failed: ${err.message || err}`);
  }
}

module.exports = {
  uploadFile,
  deleteFile,
  storage,
};
