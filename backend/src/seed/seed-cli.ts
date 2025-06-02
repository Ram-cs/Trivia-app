import axios from "axios";
import mongoose from "mongoose";
import dotenv from "dotenv";
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
const MONGO_URI = process.env.MONGO_URI || "mongodb://mongo:27017/trivia";

// Parse command line arguments
const args = process.argv.slice(2);
if (args.length < 2) {
    console.error("Usage: ts-node seed-cli.ts <number_of_questions> <append_yes_or_no>");
    process.exit(1);
}

const amount = parseInt(args[0]);
const append = args[1].toLowerCase() === "yes";

if (isNaN(amount) || amount <= 0) {
    console.error("Invalid amount. Must be a positive number.");
    process.exit(1);
}

console.log(`Seeding with ${amount} questions per category/difficulty. Append: ${append}`);

const seed = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB");

        if (!append) {
            await Category.deleteMany();
            await Question.deleteMany();
            console.log("Deleted existing data");
        }

        // Fetch and insert categories
        const categoryRes = await fetchWithRetry(
            "https://opentdb.com/api_category.php"
        );
        const categories = categoryRes.data.trivia_categories;
        if (!append) {
            await Category.insertMany(categories);
            console.log(`Inserted ${categories.length} categories`);
        }

        const difficulties = ["easy", "medium", "hard"];
        let totalQuestions = 0;
        
        for (const category of categories) {
            for (const difficulty of difficulties) {
                console.log(`Fetching ${amount} ${difficulty} questions for category ${category.name}...`);
                const qRes = await fetchWithRetry(
                    `https://opentdb.com/api.php?amount=${amount}&category=${category.id}&difficulty=${difficulty}&type=multiple`
                );
                if (qRes.data.results?.length > 0) {
                    await Question.insertMany(qRes.data.results);
                    totalQuestions += qRes.data.results.length;
                    console.log(`Inserted ${qRes.data.results.length} questions`);
                }
            }
        }

        console.log(`Database seeded successfully with ${totalQuestions} questions.`);
        process.exit(0);
    } catch (err) {
        console.error("Error during seeding:", err);
        process.exit(1);
    }
};

seed();

