import mongoose, { Schema, Document } from "mongoose";

export interface IFriendship extends Document {
  user1: mongoose.Types.ObjectId;
  user2: mongoose.Types.ObjectId;
}

const FriendshipSchema: Schema<IFriendship> = new Schema(
  {
    user1: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    user2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Friendship = mongoose.model<IFriendship>("Friendship", FriendshipSchema);
export default Friendship;
