import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
	id: Number,
	name: String,
});

export default mongoose.model("Category", categorySchema);
