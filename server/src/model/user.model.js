import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 6,
    },

    fullName: {
      type: String,
      trim: true,
    },

    companyName: {
      type: String,
      trim: true,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    avatar: {
      type: String,
      default: "",
    },

    websites: [
      {
        type: Schema.Types.ObjectId,
        ref: "Website",
      },
    ],

    // subscriptionPlan: {
    //   type: String,
    //   enum: ["free", "pro", "enterprise"],
    //   default: "free",
    // },

    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);