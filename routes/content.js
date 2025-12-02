import { Router } from "express";
import auth from "../middleware/auth.js";
import Content from "../models/Content.js";

const router = Router();

router.use(auth);

router.post("/", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return res.status(400).json({ message: "Text is required" });
    }

    const post = await Content.create({
      user: req.user._id,
      text: text.trim(),
    });

    res.status(201).json(post);
  } catch (err) {
    console.error("create content", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const posts = await Content.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(posts);
  } catch (err) {
    console.error("get content", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
