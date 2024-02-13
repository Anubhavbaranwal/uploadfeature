import { asynchandling } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/APIResponse.js";
import { Image } from "../models/Images.model.js";
import { uploadFileCloudnary } from "../utils/Cloudinary.js";

const uploadImage = asynchandling(async (req, res) => {
  const { title, description } = req.body;
  if (!title || !description) {
    throw new ApiError(400, "Please fill all fields");
  }
  if (!req.file) {
    throw new ApiError(400, "Please upload an image");
  }
  console.log(req.user._id + "user id");

  const upload = await uploadFileCloudnary(req.file?.path);

  const image = await Image.create({
    title,
    description,
    image: upload?.url,
    owner: req.user._id, //not able to get user id
  });

  if (!image) {
    throw new ApiError(500, "Error creating image");
  }
  return res
    .status(201)
    .json(new ApiResponse(201, image, "Image created successfully"));
});

const getImages = asynchandling(async (req, res) => {
  const images = await Image.find({ owner: req.user._id });
  if (!images) {
    throw new ApiError(404, "No images found");
  }
  return res.status(200).json(new ApiResponse(200, images, "Images found"));
});

const updateImage = asynchandling(async (req, res) => {
  const { title, description } = req.body;

  const img = await Image.findById(req.params.id);
  if (!img) {
    throw new ApiError(404, "Image not found");
  }
  if (img.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to update this image");
  }

  const imglink = req.file?.path;

  const upload = await uploadFileCloudnary(imglink);

  const obj = {};
  obj.title = title;
  obj.description = description;
  obj.image = upload?.url || img.image;
  obj.owner = req.user._id;

  console.log(obj);
  const image = await Image.findByIdAndUpdate(
    req.params.id,
    { $set: obj },
    { new: true, returnOriginal: false }
  );
  if (!image) {
    throw new ApiError(404, "Image not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, image, "Image updated successfully"));
});

const deleteImage = asynchandling(async (req, res) => {
  const image = await Image.findByIdAndDelete(req.params.id);
  if (!image) {
    throw new ApiError(404, "Image not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, image, "Image deleted successfully"));
});

export { uploadImage, getImages, updateImage, deleteImage };
