import mongoose from "mongoose";

const connect = async () => {
  try {
    const connected = await mongoose.connect(
      `${process.env.MONGO_URI}/${process.env.MONGO_DB}`
    );
    console.log(`Connected to MongoDB ${connected.connection.host}`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export default connect;
