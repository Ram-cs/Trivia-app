"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const questionSchema = new mongoose_1.default.Schema({
    category: String,
    type: String,
    difficulty: String,
    question: String,
    correct_answer: String,
    incorrect_answers: [String],
});
exports.default = mongoose_1.default.model("Question", questionSchema);
