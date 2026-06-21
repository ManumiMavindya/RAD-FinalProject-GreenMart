import { Router } from "express";
import { deletePlant, getAllPlants, getPlantByID, savePlant, updatePlant } from "../controller/plantController";
import { authenticate } from "../middleware/auth";
import { requireRole } from "../middleware/role";
import { UserRole } from "../models/userModel";

const router = Router();

router.get("/all", getAllPlants);
router.get("/:id", getPlantByID); 
router.post("/save", authenticate, requireRole([UserRole.ADMIN]), savePlant);
router.delete("/:id",authenticate, requireRole([UserRole.ADMIN]), deletePlant);
router.put("/:id",authenticate, requireRole([UserRole.ADMIN]), updatePlant);

export default router; 