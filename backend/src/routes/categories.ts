import express from "express";
import Category from "../models/Category";

const router = express.Router();

router.get("/", async (req, res) => {
	try {
		console.log("Fetching categories...");
		const categories = await Category.find();
		console.log("Found categories:", categories);
		res.json(categories);
	} catch (err) {
		console.error("Error fetching categories:", err);
		res.status(500).json({ error: "Failed to fetch categories" });
	}
});

export default router;
