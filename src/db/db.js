import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URL, {
      dbName: "Chat_Application",
    });

    console.log("MongoDB Connected Successfully");
    console.log("Connected database:", mongoose.connection.db.databaseName);
    console.log("MongoDB host:", mongoose.connection.host);
  } catch (error) {
    console.error("Database Connection Error:", error);
    process.exit(1);
  }
};

export default connectDB;
