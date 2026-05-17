import mongoose, { Schema } from "mongoose";

const teamSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        email: {
          type: String,
          trim: true,
          lowercase: true,
        },
        role: {
          type: String,
          enum: ["owner", "admin", "member", "viewer"],
          default: "member",
        },
        status: {
          type: String,
          enum: ["active", "invited"],
          default: "invited",
        },
      },
    ],
  },
  { timestamps: true },
);

export const Team = mongoose.model("Team", teamSchema);
