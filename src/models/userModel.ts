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
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    roles: {
      type: [String],
      enum: Object.values(UserRole),
      default: [UserRole.USER] 
    },
    phone: { type: String, required: false },
    address: { type: String, required: false }
  },
  { timestamps: true }
);

export const UserModel = model<IUser>("User", userSchema);