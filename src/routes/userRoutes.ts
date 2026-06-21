import { Router } from "express";
import { login, refreshToken, registerUser } from "../controller/authController";
import { getMyDetails, updateMyProfile, getAllCustomers, deleteCustomer } from "../controller/customerController";
import { authenticate } from "../middleware/auth"; 
import { requireRole } from "../middleware/role";
import { UserRole } from "../models/userModel";

const router = Router();

router.post("/register", registerUser);
router.post("/login", login);
router.post("/refresh-token", refreshToken);

router.get("/me", authenticate, getMyDetails);
router.put("/update-me", authenticate, updateMyProfile); 
router.get("/get-all-customers",authenticate, requireRole([UserRole.ADMIN]), getAllCustomers);
router.delete("/delete-customer/:id", authenticate, requireRole([UserRole.ADMIN]), deleteCustomer);

export default router;