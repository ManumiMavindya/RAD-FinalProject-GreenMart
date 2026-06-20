import { Request, Response } from "express";
import { PlantModel } from "../models/plantModel";
// import { error } from "node:console";

export const savePlant = async (req: Request, res:Response) =>{
    try{
        const newPlant = new PlantModel(req.body);
        const savedPlant = await newPlant.save();
        res
            .status(200)
            .json({ message: "Plant saved Successfully...", data: savedPlant});    
}   catch(err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save plant...", error: err});
    }
};


export const deletePlant = async(req: Request, res: Response) =>{
    try{
        const{id} = req.params;

        const plant = await PlantModel.findByIdAndDelete(id);

        if(!plant){
            return res.status(404).json({message: "Plant not fount.."});
        }

        res.status(200).json({ message: "Plant deleted succesfully..."});
    }catch(err){
        console.error(err);
        res.status(500).json({ message: "Failed to delete plant...", error:err});
    }
};

export const updatePlant = async (req: Request, res: Response) =>{
    try{
        const {id} = req.params;

        const updatedPlant =  await PlantModel.findByIdAndUpdate(id, req.body, {new: true});

        if(!updatedPlant){
            return res.status(404).json({message: "Plant not found..."});
        }
        res.status(200).json({message: "Plant updated successfully..."});
    }catch(err){
        console.error(err);
        res.status(500).json({message: "Failed to update plant..."})
    }
};

export const getAllPlants = async (req: Request, res: Response) =>{
    try{
        const plants = await PlantModel.find();
        res.status(200).json({ message: "ok", data: plants});
    }catch(err){
        console.error(err);
        res.status(500).json({ message: "Failed to retreive plants...", error:err});
    }
};

export const getPlantByID = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; 
    const plant = await PlantModel.findById(id);

    if (!plant) {
      return res.status(404).json({ message: "Plant not found" });
    }

    res.status(200).json({ message: "ok", data: plant });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch plant..!", error: err });
  }
};