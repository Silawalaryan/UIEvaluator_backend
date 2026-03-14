import { Router } from "express";
import { optionalAuth } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { deleteUIImage, getUIImage } from "../controllers/image.controller.js";

const router = Router();
router.route("/upload").post(optionalAuth, upload.single("image"), getUIImage);
//router.route("/:imageId").delete(verifyJwt, deleteUIImage);

export default router;
