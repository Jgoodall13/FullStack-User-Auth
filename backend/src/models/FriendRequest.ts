import mongoose, { Schema, Document } from "mongoose";

export interface IFriendRequest extends Document {
  requester: mongoose.Types.ObjectId; // User who sent the request
  recipient: mongoose.Types.ObjectId; // User receiving the request
  status: "pending" | "confirmed" | "ignored"; // Request status
}

const FriendRequestSchema: Schema<IFriendRequest> = new Schema(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "ignored"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const FriendRequest = mongoose.model<IFriendRequest>(
  "FriendRequest",
  FriendRequestSchema
);
export default FriendRequest;
