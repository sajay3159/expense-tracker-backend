import { Router } from "express";
const router = Router();
import auth from "../middleware/auth.js";
import {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
  getSummary,
} from "../controllers/expensesController.js";

router.use(auth);

router.post("/", createExpense);
router.get("/", getExpenses);
router.patch("/:id", updateExpense);
router.delete("/:id", deleteExpense);

router.get("/summary", getSummary);

export default router;
