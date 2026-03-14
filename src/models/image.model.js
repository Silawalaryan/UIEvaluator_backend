import mongoose, { Schema } from "mongoose";
const imageSchema = new Schema(
  {
    document: {
      type: String,
      required: true,
    },
    cloudinaryPublicId:{
      type:String,
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);
export const Image = mongoose.model("Image", imageSchema);
