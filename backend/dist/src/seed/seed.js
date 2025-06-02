"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const readline_1 = __importDefault(require("readline"));
const Category_1 = __importDefault(require("../models/Category"));
const Question_1 = __importDefault(require("../models/Question"));
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const fetchWithRetry = (url_1, ...args_1) => __awaiter(void 0, [url_1, ...args_1], void 0, function* (url, retries = 3) {
    var _a;
    for (let i = 0; i < retries; i++) {
        try {
            const response = yield axios_1.default.get(url);
            yield delay(1000); // Wait 1 second between requests
            return response;
        }
        catch (error) { // Type the error as 'any' since we know it's from axios
            if (((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.status) === 429) {
                console.log(`Rate limited, waiting 5 seconds before retry ${i + 1}/${retries}`);
                yield delay(5000);
                continue;
            }
            throw error;
        }
    }
    throw new Error(`Failed after ${retries} retries`);
});
dotenv_1.default.config();
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/trivia";
const rl = readline_1.default.createInterface({
    input: process.stdin,
    output: process.stdout,
});
const askQuestion = (query) => {
    return new Promise((resolve) => rl.question(query, resolve));
};
const seed = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const amountInput = yield askQuestion("How many questions per category/difficulty do you want to seed? ");
        const amount = parseInt(amountInput);
        if (isNaN(amount) || amount <= 0) {
            console.error("Invalid amount. Exiting.");
            process.exit(1);
        }
        const appendInput = yield askQuestion("Append to existing data? (yes/no): ");
        const append = appendInput.toLowerCase() === "yes";
        yield mongoose_1.default.connect(MONGO_URI);
        if (!append) {
            yield Category_1.default.deleteMany();
            yield Question_1.default.deleteMany();
        }
        // Fetch and insert categories
        const categoryRes = yield fetchWithRetry("https://opentdb.com/api_category.php");
        const categories = categoryRes.data.trivia_categories;
        if (!append)
            yield Category_1.default.insertMany(categories);
        const difficulties = ["easy", "medium", "hard"];
        for (const category of categories) {
            for (const difficulty of difficulties) {
                const qRes = yield fetchWithRetry(`https://opentdb.com/api.php?amount=${amount}&category=${category.id}&difficulty=${difficulty}&type=multiple`);
                if (((_a = qRes.data.results) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                    yield Question_1.default.insertMany(qRes.data.results);
                }
            }
        }
        console.log("Database seeded successfully.");
        rl.close();
        process.exit(0);
    }
    catch (err) {
        console.error("Error during seeding:", err);
        rl.close();
        process.exit(1);
    }
});
seed();
