import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_CLOUD_APIKEY,
  api_secret: process.env.CLOUDINARY_CLOUD_APISECRET,
});

const uploadFileCloudnary = async (localpath) => {
  try {
    if (localpath == null) return null;
    console.log(localpath + " a");

    const response = await cloudinary.uploader.upload(localpath, {
      resource_type: "auto",
    });
    fs.unlinkSync(localpath);
    console.log(response);
    return response;
  } catch (error) {
    fs.unlinkSync(localpath);
    return null;
  }
};
//when updating new image, delete the old one from cloudinary
const deleteFilefromcloudinary = async (localpath) => {
  try {
    if (localpath == null) return null;
    const response = await cloudinary.uploader.destroy(localpath);
    return response;
  } catch (error) {
    return null;
  }
};

export { uploadFileCloudnary, deleteFilefromcloudinary };
