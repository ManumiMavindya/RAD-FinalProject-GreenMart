import { Response, Request } from "express"; 
import { AuthRequest } from "../middleware/auth";
import { UserModel,UserRole } from "../models/userModel";

export const getMyDetails = async (req: AuthRequest, res: Response ) => {
    try{
        if(!req.user){
            return res.status(401).json({message: "Unauthorized"});
        }
        const user = await UserModel.findById(req.user.sub).select("-password");

        if(!user){
            return res.status(404).json({message: "User not found..."});
        }
        res.status(200).json({message: "ok", data: user});
    }catch(err){
        console.error(err);
        res.status(500).json({message: "Server error while fetching profile"});
    }
}; 

export const updateMyProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.body.password) {
      delete req.body.password; 
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      req.user.sub, 
      req.body, 
      { new: true }
    ).select("-password");

    res.status(200).json({ message: "Profile updated successfully..!", data: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

export const getAllCustomers = async (req: Request, res: Response) => {
  try {
    const customers = await UserModel.find({ roles: UserRole.USER }).select("-password");

    res.status(200).json({ message: "ok", data: customers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to retrieve customers..!", error: err });
  }
};

export const deleteCustomer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedUser = await UserModel.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "Customer not found..!" });
    }

    res.status(200).json({ message: "Customer deleted successfully..!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete customer..!", error: err });
  }
};