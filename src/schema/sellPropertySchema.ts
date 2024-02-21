import mongoose, { Document, Model, Schema } from "mongoose";

// Define an interface for the SellProperty document
interface ISellProperty extends Document {
    propertyType: string;
    district: string;
    taluka: string;
    state: string;
    locationURL?: string;
    uploadFilePath: string[];
    amount: number;
    descriptions: string;
}

// Define the schema
const sellPropertySchema: Schema<ISellProperty> = new Schema({
    propertyType: { type: String, default: null },
    taluka: { type: String, default: null },
    district: { type: String, default: null },
    state: { type: String, default: null },
    locationURL: { type: String },
    uploadFilePath: [{ type: String }],
    amount: { type: Number, default: null },
    descriptions: { type: String, default: null },
});

// Create the model
const SellProperty: Model<ISellProperty> = mongoose.model<ISellProperty>('SellProperty', sellPropertySchema, 'sellproperty');

export default SellProperty;
