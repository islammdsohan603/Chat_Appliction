import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connect(process.env.MONGO_DB_URL);
    console.log("DB Connected Successfully");
  } catch (error) {
    console.log("DataBase Connected Error", error);
  }
};

export default connectDB;
