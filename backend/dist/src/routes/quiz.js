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
const express_1 = __importDefault(require("express"));
const Question_1 = __importDefault(require("../models/Question"));
const router = express_1.default.Router();
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { category, difficulty, amount } = req.query;
    try {
        const questions = yield Question_1.default.aggregate([
            { $match: { category: category, difficulty: difficulty } },
            { $sample: { size: parseInt(amount) || 5 } },
        ]);
        const sanitized = questions.map((q) => {
            const allAnswers = [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5);
            return {
                id: q._id,
                question: q.question,
                answers: allAnswers,
            };
        });
        res.json(sanitized);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch quiz questions" });
    }
}));
router.post("/score", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { answers } = req.body; // [{ id: string, answer: string }]
    try {
        const questionDocs = yield Question_1.default.find({
            _id: { $in: answers.map((a) => a.id) },
        });
        let score = 0;
        const results = answers.map((a) => {
            const q = questionDocs.find((q) => q._id.toString() === a.id);
            const isCorrect = q && q.correct_answer === a.answer;
            if (isCorrect)
                score++;
            return {
                id: a.id,
                question: q === null || q === void 0 ? void 0 : q.question,
                selected: a.answer,
                correct: q === null || q === void 0 ? void 0 : q.correct_answer,
                isCorrect,
            };
        });
        res.json({ score, results });
    }
    catch (err) {
        res.status(500).json({ error: "Scoring failed" });
    }
}));
exports.default = router;
