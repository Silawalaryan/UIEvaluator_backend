import { asyncHandler } from "../utils/asyncHandler.js";
import { Image } from "../models/image.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { parseObjectId } from "../utils/parseObjectId.js";
import { deleteFromCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";

const getUIImage = asyncHandler(async (req, res) => {
  const imageLocalPath = req.file?.path;
  const guestId = req.headers["x-guest-id"];

  if (!imageLocalPath) {
    throw new ApiError(403, "UI image is compulsory to upload");
  }
  let userId;
  if (req.user) {
    userId = req.user._id;
  } else {
    if (!guestId) {
      throw new ApiError(403, "Guest id is necessary");
    }

    let guestUser = await User.findOne({ guestId, isGuest: true });
    if (!guestUser) {
      guestUser = await User.create({
        guestId,
        isGuest: true,
      });
      if (!guestUser) {
        throw new ApiError(500, "Guest user instance not created");
      }
    }
    userId = guestUser._id;
  }
  const image = await uploadOnCloudinary(imageLocalPath);
  if (!image) {
    throw new ApiError(403, "UI image is compulsory to upload");
  }
  const storedImage = await Image.create({
    document: image.url,
    cloudinaryPublicId: image.public_id,
    uploadedBy: userId,
  });
  if (!storedImage) {
    throw new ApiError(500, "UI image storage unsuccessful.");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, storedImage, "UI image stored successfully."));
});
const deleteUIImage = asyncHandler(async (req, res) => {
  const { imageId } = req.params;
  const [RealImageObjectId] = parseObjectId([imageId]);
  const image = await Image.findById(RealImageObjectId);
  await deleteFromCloudinary(image.cloudinaryPublicId);
  const deletedImage = await Image.findByIdAndDelete(RealImageObjectId);
  if (!deletedImage) {
    throw new ApiError(500, "Error while deleting image from database.");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Image deleted successfully."));
});
export { getUIImage, deleteUIImage };
