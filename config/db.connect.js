import mongoose from "mongoose";

export const connectDatabase = () => {
  let DB_URL = process.env.DB_URL;

  mongoose.connect(DB_URL).then((con) => {
    console.log(
      `MongoDB Database connected with HOST: ${con?.connection?.host}`
    );
  });
};
