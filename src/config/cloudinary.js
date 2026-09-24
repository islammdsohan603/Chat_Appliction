import { v2 as cloudinary } from "cloudinary";

import fs from "fs";

const uploadOnCloudinary = async (filePath) => {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.API_SECRET,
  });

  try {
    if (!filePath) return null;
    console.log("Starting upload for filePath:", filePath);
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
    });
    console.log("Cloudinary Upload Success. URL:", uploadResult.secure_url);
    fs.unlinkSync(filePath);
    return uploadResult.secure_url;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    return null;
  }
};

export default uploadOnCloudinary;
