import mongoose from "mongoose";

const dataBase = async () => {
  const maxRetries = 5;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      await mongoose.connect(process.env.MONGOOSECONNECTION, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });
      console.log("✅ MongoDB connected successfully");
      return;
    } catch (error) {
      retries++;
      console.error(`❌ MongoDB connection attempt ${retries} failed:`, error);
      if (retries === maxRetries) {
        console.error("Max database reconnection retries reached. Exiting...");
        process.exit(1);
      }
      // Wait with exponential backoff before retrying
      await new Promise((resolve) => setTimeout(resolve, Math.min(1000 * Math.pow(2, retries), 10000)));
    }
  }
};

export default dataBase;