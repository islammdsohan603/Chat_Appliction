import { v2 as cloudinary } from "cloudinary";

import fs from "fs";

const uploadOnCloudinary = async (filePath) => {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.API_SECRET,
  });

  try {
    const uploadResult = await cloudinary.uploader(filePath);
    fs.unlink(filePath);
    return uploadResult.secure_url;
  } catch (error) {
    fs.unlink(filePath);
    console.log(error);
  }
};

export default uploadOnCloudinary;
