"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const categories_1 = __importDefault(require("./routes/categories"));
const quiz_1 = __importDefault(require("./routes/quiz"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api/categories", categories_1.default);
app.use("/api/quiz", quiz_1.default);
const PORT = process.env.PORT || 5001;
mongoose_1.default
    .connect(process.env.MONGO_URI)
    .then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})
    .catch((err) => console.error(err));
exports.default = app;
