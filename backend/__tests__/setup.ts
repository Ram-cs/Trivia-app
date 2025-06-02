import { jest } from "@jest/globals";
import mongoose from "mongoose";

const TEST_DB_URI = "mongodb://localhost:27017/trivia_test";

// Increase timeout for database operations
jest.setTimeout(30000);

// Connect to test database before all tests
beforeAll(async () => {
	try {
		await mongoose.connect(TEST_DB_URI);
	} catch (error) {
		console.error("Error connecting to test database:", error);
		throw error;
	}
});

// Handle MongoDB connection errors
mongoose.connection.on("error", (err) => {
	console.error("MongoDB connection error:", err);
});

// Clean up after all tests
afterAll(async () => {
	try {
		await mongoose.connection.close();
	} catch (error) {
		console.error("Error closing database connection:", error);
	}
});
