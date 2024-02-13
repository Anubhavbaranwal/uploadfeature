import { Router } from "express";
import {
  uploadImage,
  getImages,
  updateImage,
  deleteImage,
} from "../controllers/Image.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { VerifyJWT } from "../middleware/auth.middleware.js";
const router = Router();

router.route("/").get(VerifyJWT, getImages);
router.route("/upload").post(VerifyJWT, upload.single("image"), uploadImage);
router.route("/:id").put(VerifyJWT, updateImage);
router.route("/:id").delete(VerifyJWT, deleteImage);

export default router;
