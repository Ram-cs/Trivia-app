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
const supertest_1 = __importDefault(require("supertest"));
const mongoose_1 = __importDefault(require("mongoose"));
const index_1 = __importDefault(require("../src/index"));
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connect(process.env.MONGO_URI || "mongodb://mongo:27017/trivia");
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
}));
describe("GET /api/categories", () => {
    it("should return categories array", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(index_1.default).get("/api/categories");
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
    }));
});
describe("GET /api/quiz", () => {
    it("should return quiz questions", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(index_1.default).get("/api/quiz?category=9&difficulty=easy&amount=5");
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(5);
        expect(res.body[0]).toHaveProperty("question");
        expect(res.body[0]).toHaveProperty("answers");
    }));
});
