import express, { Request, Response, Router } from "express";
import Question from "../models/Question";
import Category from "../models/Category";

const router: Router = express.Router();

interface QuizQuery {
	category?: string;
	difficulty?: string;
	amount?: string;
}

router.get("/", async (req: Request<{}, {}, {}, QuizQuery>, res: Response) => {
	const { category, difficulty, amount } = req.query;

	console.log("Received request with params:", {
		category,
		difficulty,
		amount,
	});

	if (!difficulty) {
		return res.status(400).json({ error: "Difficulty is required" });
	}

	try {
		// If category is a number, find the corresponding category name
		let categoryName = category?.toString();
		if (category && !isNaN(Number(category))) {
			const categoryDoc = await Category.findOne({
				id: Number(category),
			});
			if (categoryDoc) {
				categoryName = categoryDoc.name;
			}
		}

		const matchQuery = {
			...(categoryName && { category: categoryName }),
			difficulty: difficulty?.toString().toLowerCase(),
		};

		const questions = await Question.aggregate([
			{ $match: matchQuery },
			{ $sample: { size: parseInt(amount as string) || 5 } },
		]);

		if (questions.length === 0) {
			console.log("No questions found for query:", matchQuery);
			return res.status(404).json({
				error: "No questions found for the given criteria",
				query: matchQuery,
			});
		}

		const sanitized = questions.map((q) => {
			const allAnswers = [...q.incorrect_answers, q.correct_answer].sort(
				() => Math.random() - 0.5
			);
			return {
				id: q._id,
				question: q.question,
				answers: allAnswers,
			};
		});
		res.json(sanitized);
	} catch (err) {
		console.error("Error in /api/quiz:", err);
		res.status(500).json({ error: "Failed to fetch quiz questions" });
	}
});

router.post("/score", async (req, res) => {
	const { answers } = req.body; // [{ id: string, answer: string }]

	try {
		const questionDocs = await Question.find({
			_id: { $in: answers.map((a: any) => a.id) },
		});
		let score = 0;

		const results = answers.map((a: any) => {
			const q = questionDocs.find((q) => q._id.toString() === a.id);
			const isCorrect = q && q.correct_answer === a.answer;
			if (isCorrect) score++;
			return {
				id: a.id,
				question: q?.question,
				selected: a.answer,
				correct: q?.correct_answer,
				isCorrect,
			};
		});

		res.json({ score, results });
	} catch (err) {
		res.status(500).json({ error: "Scoring failed" });
	}
});

export default router;
