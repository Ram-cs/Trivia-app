import axios from "axios";
import mongoose from "mongoose";
import dotenv from "dotenv";
import readline from "readline";
import Category from "../models/Category";
import Question from "../models/Question";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const fetchWithRetry = async (url: string, retries = 5): Promise<any> => {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await axios.get(url);
            await delay(2000); // Wait 2 seconds between requests
            return response;
        } catch (error: any) {  // Type the error as 'any' since we know it's from axios
            if (error?.response?.status === 429) {
                console.log(`Rate limited, waiting 10 seconds before retry ${i + 1}/${retries}`);
                await delay(10000);
                continue;
            }
            throw error;
        }
    }
    throw new Error(`Failed after ${retries} retries`);
};

dotenv.config();
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/trivia";

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

const askQuestion = (query: string): Promise<string> => {
	return new Promise((resolve) => rl.question(query, resolve));
};

const seed = async () => {
	try {
		const amountInput = await askQuestion(
			"How many questions per category/difficulty do you want to seed? "
		);
		const amount = parseInt(amountInput);
		if (isNaN(amount) || amount <= 0) {
			console.error("Invalid amount. Exiting.");
			process.exit(1);
		}

		const appendInput = await askQuestion(
			"Append to existing data? (yes/no): "
		);
		const append = appendInput.toLowerCase() === "yes";

		await mongoose.connect(MONGO_URI);

		if (!append) {
			await Category.deleteMany();
			await Question.deleteMany();
		}

		// Fetch and insert categories
		const categoryRes = await fetchWithRetry(
			"https://opentdb.com/api_category.php"
		);
		const categories = categoryRes.data.trivia_categories;
		if (!append) await Category.insertMany(categories);

		const difficulties = ["easy", "medium", "hard"];
		for (const category of categories) {
			for (const difficulty of difficulties) {
				const qRes = await fetchWithRetry(
					`https://opentdb.com/api.php?amount=${amount}&category=${category.id}&difficulty=${difficulty}&type=multiple`
				);
				if (qRes.data.results?.length > 0) {
					await Question.insertMany(qRes.data.results);
				}
			}
		}

		console.log("Database seeded successfully.");
		rl.close();
		process.exit(0);
	} catch (err) {
		console.error("Error during seeding:", err);
		rl.close();
		process.exit(1);
	}
};

seed();
