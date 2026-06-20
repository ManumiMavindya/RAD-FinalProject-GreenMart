import { Document, model, Schema } from "mongoose";

interface IPlant extends Document{
    name:string;
    category:string;
    price:number;
    stock:number;
    imageURL:string;
    description:string;
}

const plantSchema = new Schema<IPlant>(
    {
        name:{type: String, required:true},
        category: { type: String, required: true },
        price: { type: Number, required: true },
        stock: { type: Number, required: true, default: 0 },
        imageURL: { type: String, required: true },
        description: { type: String, required: true }
    },
    { timestamps: true}
);

export const PlantModel = model<IPlant>("plants",plantSchema);