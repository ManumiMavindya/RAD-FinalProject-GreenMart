 import { Document, model, Schema } from "mongoose";

 export enum UserRole{
    ADMIN = "ADMIN",
    USER = "USER"
 }

export interface IUser extends Document{
    name: string;
    email: string;
    password: string;
    roles: UserRole[];
    phone?: string;    
    address?: string;
}

const userSchema = new Schema<IUser>(
  {
    name: { 
      type: String, 
      required: [true,"Name is required!"], 
      trim: true},

    email: { 
      type: String, 
      required: [true, "Email is required!"], 
      unique: true, trim:true, 
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email address!"] },

    password: { 
      type: String, 
      required: [true, "Password is required!"] },

    roles: {
      type: [String],
      enum: Object.values(UserRole),
      default: [UserRole.USER] 
    },
    phone: { 
      type: String, 
      required: false, 
      trim: true, 
      match: [/^(?:0|94|\+94)?(?:7(0|1|2|4|5|6|7|8)\d{7})$/, "Please enter a valid Sri Lankan phone number!"] },

    address: { 
      type: String, 
      required: false, 
      trim: true }
  },
  
  { timestamps: true }
);

export const UserModel = model<IUser>("User", userSchema);