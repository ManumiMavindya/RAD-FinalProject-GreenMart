import { Router } from "express";
import { login, refreshToken, registerUser } from "../controller/authController";
import { getMyDetails, updateMyProfile, getAllCustomers, deleteCustomer } from "../controller/customerController";
import { authenticate } from "../middleware/auth"; 

const router = Router();

router.post("/register", registerUser);
// router.post("/register-admin", registerAdmin);
router.post("/login", login);
router.post("/refresh-token", refreshToken);

router.get("/me", authenticate, getMyDetails);
router.put("/update-me", authenticate, updateMyProfile); 
router.get("/get-all-customers", getAllCustomers);
router.delete("/delete-customer/:id", deleteCustomer);


export default router;