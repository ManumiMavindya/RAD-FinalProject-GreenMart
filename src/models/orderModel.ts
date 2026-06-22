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
    invoiceNumber: { 
      type: String, 
      unique: true, 
      required: true },

    userId: { 
      type: Schema.Types.ObjectId, 
      ref: "User", 
      required: [true, "Invoice number is required!"] }, 

    customerName: { 
      type: String, 
      required: [true, "Customer name is required!"] },

    shippingAddress: { 
      type: String, 
      required: [true, "Shipping address is required!"] },

    phone: { 
      type: String, 
      required: [true, "Phone number is required!"],
      match: [/^(?:0|94|\+94)?(?:7(0|1|2|4|5|6|7|8)\d{7})$/, "Please enter a valid Sri Lankan phone number!"] },
    
    items: [
      {
        plantId: { 
          type: Schema.Types.ObjectId, 
          ref: "plants", 
          required: [true, "Plant ID is required!"] },

        name: { 
          type: String, 
          required: [true, "Plant name is required!"] },

        quantity: { 
          type: Number, 
          required: [true, "Quantity is required!"],
          min: [1, "Quantity cannot be less than 1!"] },

        price: { 
          type: Number, 
          required: [true, "Price is required!"],
          min: [0, "Price cannot be negative!"] }
      }
    ],
    totalAmount: { 
      type: Number, 
      required: true },
    
      status: { 
      type: String, 
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"], 
      default: "Pending" 
    }
  },
  { timestamps: true } 
);

export const OrderModel = mongoose.model<IOrder>("Order", OrderSchema);