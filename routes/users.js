import express from "express";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/me", auth, (req, res) => {
  res.json(req.user);
});

router.patch("/me", auth, async (req, res) => {
  const updates = req.body;
  Object.assign(req.user, updates);
  await req.user.save();
  res.json(req.user);
});

export default router;
