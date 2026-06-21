import express from "express";
import { getDashboardStats } from "../controller/adminController";
import { authenticate } from "../middleware/auth";
import { requireRole } from "../middleware/role";
import { UserRole } from "../models/userModel";

const router = express.Router();

router.get("/stats",authenticate, requireRole([UserRole.ADMIN]), getDashboardStats);

export default router;