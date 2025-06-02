import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import categoryRoutes from "./routes/categories";
import quizRoutes from "./routes/quiz";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/categories", categoryRoutes);
app.use("/api/quiz", quizRoutes);

// Separate function to start the server
export const startServer = async () => {
  const PORT = process.env.PORT || 5001;
  
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/trivia");
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
    return server;
  } catch (err) {
    console.error("Failed to start server:", err);
    throw err;
  }
};

// Only start the server if this file is executed directly
if (require.main === module) {
  startServer().catch(err => {
    console.error("Failed to start server:", err);
    process.exit(1);
  });
}

export default app;
