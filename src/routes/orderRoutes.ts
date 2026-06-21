import { Router } from "express";
import { placeOrder, getMyOrders, getAllOrders, cancelOrder, updateOrderDetails, downloadInvoice  } from "../controller/orderController";
import { authenticate } from "../middleware/auth"; 

const router = Router();

router.post("/place", authenticate, placeOrder);
router.get("/my-orders", authenticate, getMyOrders);
router.put("/cancel/:id", authenticate, cancelOrder);
router.put("/update-details/:id", authenticate, updateOrderDetails);
router.get("/:id/invoice", downloadInvoice);


export default router; 