import { Router } from "express";
import { placeOrder, getMyOrders, getAllOrders, cancelOrder, updateOrderDetails, downloadInvoice  } from "../controller/orderController";
import { authMiddleware } from "../middleware/auth"; 

const router = Router();

router.post("/place", authMiddleware, placeOrder);
router.get("/my-orders", authMiddleware, getMyOrders);
router.put("/cancel/:id", authMiddleware, cancelOrder);
router.put("/update-details/:id", authMiddleware, updateOrderDetails);
router.get("/:id/invoice", downloadInvoice);


export default router; 