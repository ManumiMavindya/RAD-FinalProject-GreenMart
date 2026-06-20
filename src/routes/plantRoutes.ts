import { Router } from "express";
import { deletePlant, getAllPlants, getPlantByID, savePlant, updatePlant } from "../controller/plantController";

const router = Router();

router.get("/all", getAllPlants);
router.get("/:id", getPlantByID); 
router.post("/save", savePlant);
router.delete("/:id", deletePlant);
router.put("/:id", updatePlant);

export default router; 