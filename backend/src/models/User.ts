import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  refreshToken: { type: String },
  role: { type: String, enum: ["user", "admin"], default: "user" },
});

// Hash the password before saving
UserSchema.pre("save", async function (next) {
  // This is done here but can be done in the controller as well
  if (!this.isModified("password")) return next(); // Only hash password if it’s modified
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export default mongoose.model("User", UserSchema);
