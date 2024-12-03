import mongoose from "mongoose";
import logger from "../utils/logger";

const connectDB = async () => {
  const mongoURI = process.env.ATLAS_URI || "";
  console.log(mongoURI);
  try {
    const conn = await mongoose.connect(mongoURI, {});
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err: any) {
    logger.error(`Error: ${err.message}`);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
