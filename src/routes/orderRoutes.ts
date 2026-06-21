import { Router } from "express";
import { placeOrder, getMyOrders, getAllOrders, cancelOrder, updateOrderDetails, downloadInvoice  } from "../controller/orderController";
import { authenticate } from "../middleware/auth"; 
import { requireRole } from "../middleware/role";
import { UserRole } from "../models/userModel";

const router = Router();

router.post("/place", authenticate, placeOrder);
router.get("/my-orders", authenticate, getMyOrders);
router.put("/cancel/:id", authenticate, cancelOrder);
router.put("/update-details/:id", authenticate, updateOrderDetails);
router.get("/:id/invoice", authenticate, downloadInvoice);
router.get("/all-orders", authenticate, requireRole([UserRole.ADMIN]), getAllOrders);



export default router; 