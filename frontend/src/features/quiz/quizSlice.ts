import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export interface Category {
	id: number;
	name: string;
}

export interface Question {
	id: string;
	question: string;
	answers: string[];
}

export interface Result {
	id: string;
	question: string;
	selected: string;
	correct: string;
	isCorrect: boolean;
}

interface QuizState {
	categories: Category[];
	questions: Question[];
	selectedAnswers: Record<string, string>;
	selectedCategory: number | null;
	selectedDifficulty: string;
	currentCategory: number | null;
	currentDifficulty: string;
	amount: number;
	currentAmount: number;
	previousAmount: number;
	status: "idle" | "loading" | "succeeded" | "failed";
	error: string | null;
	score: number;
	results: Result[];
	previousCategory: number | null;
	previousDifficulty: string;
}

const initialState: QuizState = {
	categories: [],
	questions: [],
	selectedAnswers: {},
	selectedCategory: null,
	selectedDifficulty: "Easy",
	currentCategory: null,
	currentDifficulty: "",
	amount: 5,
	currentAmount: 0,
	previousAmount: 0,
	status: "idle",
	error: null,
	score: 0,
	results: [],
	previousCategory: null,
	previousDifficulty: "",
};

export const fetchCategories = createAsyncThunk(
	"quiz/fetchCategories",
	async () => {
		try {
			console.log("Fetching categories from API...");
			const response = await axios.get(
				"http://localhost:5001/api/categories"
			);
			console.log("API Response:", response.data);
			return response.data;
		} catch (error) {
			console.error("Error fetching categories:", error);
			throw error;
		}
	}
);

export const fetchQuestions = createAsyncThunk(
	"quiz/fetchQuestions",
	async (_, { getState }) => {
		const state = getState() as { quiz: QuizState };
		const { selectedCategory, selectedDifficulty, amount } = state.quiz;
		const response = await axios.get("http://localhost:5001/api/quiz", {
			params: {
				category: selectedCategory,
				difficulty: selectedDifficulty,
				amount,
			},
		});
		return response.data;
	}
);

const quizSlice = createSlice({
	name: "quiz",
	initialState,
	reducers: {
		setSelectedCategory(state, action) {
			state.selectedCategory = action.payload;
			state.currentCategory = action.payload;
		},
		setDifficulty(state, action) {
			state.selectedDifficulty = action.payload;
			state.currentDifficulty = action.payload;
		},
		setAmount(state, action) {
			state.amount = action.payload;
			state.currentAmount = action.payload;
		},
		selectAnswer(state, action) {
			const { questionId, answer } = action.payload;
			state.selectedAnswers[questionId] = answer;
		},
		setScore(state, action) {
			state.score = action.payload.score;
			state.results = action.payload.results;
		},
		resetQuiz(state) {
			state.questions = [];
			state.selectedAnswers = {};
			state.score = 0;
			state.results = [];
		},
		updatePreviousSelections(state) {
			state.previousCategory = state.currentCategory;
			state.previousDifficulty = state.currentDifficulty;
			state.previousAmount = state.currentAmount;
		},
		clearCurrentSelections(state) {
			state.currentCategory = null;
			state.currentDifficulty = "";
			state.currentAmount = 0;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchCategories.pending, (state) => {
				state.status = "loading";
			})
			.addCase(fetchCategories.fulfilled, (state, action) => {
				state.status = "succeeded";
				state.categories = action.payload;
			})
			.addCase(fetchCategories.rejected, (state, action) => {
				state.status = "failed";
				state.error =
					action.error.message || "Failed to fetch categories";
			})
			.addCase(fetchQuestions.pending, (state) => {
				state.status = "loading";
			})
			.addCase(fetchQuestions.fulfilled, (state, action) => {
				state.status = "succeeded";
				state.questions = action.payload;
				state.selectedAnswers = {};
			})
			.addCase(fetchQuestions.rejected, (state, action) => {
				state.status = "failed";
				state.error =
					action.error.message || "Failed to fetch questions";
			});
	},
});

export const {
	setSelectedCategory,
	setDifficulty,
	setAmount,
	selectAnswer,
	resetQuiz,
	setScore,
	updatePreviousSelections,
	clearCurrentSelections,
} = quizSlice.actions;
export default quizSlice.reducer;
