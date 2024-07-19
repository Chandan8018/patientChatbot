import express from "express";
import {
  updateUser,
  deleteUser,
  getUsersForSidebar,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.put("/update/:userId", verifyToken, updateUser);
router.delete("/delete/:userId", verifyToken, deleteUser);
router.get("/", verifyToken, getUsersForSidebar);

export default router;
