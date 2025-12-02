import mongoose from "mongoose";
import Expense from "../models/Expense.js";

// Create Expense
export const createExpense = async (req, res) => {
  const { amount, description, category } = req.body;
  if (!amount || !description || !category) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const newExpense = await Expense.create({
      amount,
      description,
      category,
      user: req.user._id,
    });
    res.status(201).json(newExpense);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get Expenses
export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update Expense
export const updateExpense = async (req, res) => {
  const { amount, description, category } = req.body;

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid expense ID" });
  }

  try {
    const updatedExpense = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { amount, description, category },
      { new: true }
    );
    if (!updatedExpense)
      return res.status(404).json({ message: "Expense not found" });
    res.json(updatedExpense);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete Expense
export const deleteExpense = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid expense ID" });
  }

  try {
    const deletedExpense = await Expense.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!deletedExpense)
      return res.status(404).json({ message: "Expense not found" });
    res.json({ message: "Expense deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

//get summary
export const getSummary = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.user._id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const summary = await Expense.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user._id),
          date: { $gte: startOfMonth, $lt: startOfNextMonth },
        },
      },
      {
        $group: { _id: "$category", total: { $sum: "$amount" } },
      },
      { $project: { category: "$_id", total: 1, _id: 0 } },
      { $sort: { total: -1 } },
    ]);

    res.json(summary);
  } catch (err) {
    console.error("getSummary", err);
    res.status(500).json({ message: "Server error" });
  }
};
