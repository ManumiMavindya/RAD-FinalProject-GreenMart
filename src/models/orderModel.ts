import mongoose, { Schema, Document } from "mongoose";

interface IOrderItem {
  plantId: mongoose.Types.ObjectId;
  name: string;
  quantity: number;
  price: number;
}

export interface IOrder extends Document {
  invoiceNumber: string; // readble order id 
  userId: mongoose.Types.ObjectId;
  customerName: string;
  shippingAddress: string;
  phone: string;
  items: IOrderItem[];
  totalAmount: number;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  createdAt: Date;
}

const OrderSchema: Schema = new Schema(
  {
    invoiceNumber: { type: String, unique: true, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, 
    customerName: { type: String, required: true },
    shippingAddress: { type: String, required: true },
    phone: { type: String, required: true },
    items: [
      {
        plantId: { type: Schema.Types.ObjectId, ref: "plants", required: true },
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }
      }
    ],
    totalAmount: { type: Number, required: true },
    status: { 
      type: String, 
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"], 
      default: "Pending" 
    }
  },
  { timestamps: true } 
);

export const OrderModel = mongoose.model<IOrder>("Order", OrderSchema);