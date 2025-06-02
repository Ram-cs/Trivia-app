import request from "supertest";
import app from "../src/index";
import Category from "../src/models/Category";
import Question from "../src/models/Question";

// Sample test data
const testCategory = { id: 9, name: "General Knowledge" };
const testQuestions = [
	{
		category: "General Knowledge",
		type: "multiple",
		difficulty: "easy",
		question: "What is the capital of France?",
		correct_answer: "Paris",
		incorrect_answers: ["London", "Berlin", "Madrid"],
	},
	{
		category: "General Knowledge",
		type: "multiple",
		difficulty: "easy",
		question: "What is the largest planet in our solar system?",
		correct_answer: "Jupiter",
		incorrect_answers: ["Saturn", "Mars", "Earth"],
	},
	{
		category: "General Knowledge",
		type: "multiple",
		difficulty: "easy",
		question: "What is the tallest mountain in the world?",
		correct_answer: "Mount Everest",
		incorrect_answers: ["K2", "Kangchenjunga", "Lhotse"],
	},
	{
		category: "General Knowledge",
		type: "multiple",
		difficulty: "easy",
		question: "What is the largest ocean on Earth?",
		correct_answer: "Pacific Ocean",
		incorrect_answers: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean"],
	},
	{
		category: "General Knowledge",
		type: "multiple",
		difficulty: "easy",
		question: "What is the largest country by land area?",
		correct_answer: "Russia",
		incorrect_answers: ["Canada", "China", "United States"],
	},
];

beforeAll(async () => {
	// Clear test database
	await Question.deleteMany({});
	await Category.deleteMany({});

	// Seed test data
	await Category.create(testCategory);
	await Question.create(testQuestions);
});

describe("GET /api/categories", () => {
	it("should return categories array", async () => {
		const res = await request(app).get("/api/categories");
		expect(res.statusCode).toBe(200);
		expect(Array.isArray(res.body)).toBe(true);
		expect(res.body.length).toBeGreaterThan(0);
		expect(res.body[0]).toHaveProperty("name", "General Knowledge");
	});
});

describe("GET /api/quiz", () => {
	it("should return quiz questions", async () => {
		const res = await request(app).get(
			"/api/quiz?category=9&difficulty=easy&amount=5"
		);
		expect(res.statusCode).toBe(200);
		expect(res.body.length).toBe(5);
		expect(res.body[0]).toHaveProperty("question");
		expect(res.body[0]).toHaveProperty("answers");
	});
});
