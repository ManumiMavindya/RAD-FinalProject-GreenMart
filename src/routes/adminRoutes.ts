import express from "express";
import { getDashboardStats } from "../controller/adminController";
// import { protect, adminOnly } from "../middleware/authMiddleware"; // 👈 ඔයාගේ Auth Middleware තියෙනවා නම් මෙතනට සෙට් කරන්න මචං

const router = express.Router();

router.get("/stats", getDashboardStats);

export default router;