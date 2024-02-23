import mongoose, { Document, Model, Schema ,ObjectId} from "mongoose";

// Define an interface for the BuyProperty document
interface IBuyProperty extends Document {
    propertyType: string;
    district: string;
    taluka: string;
    audio?: string;
    descriptions: string;
    isDeleted: boolean;
    userId:ObjectId;
}

// Define the schema
const buyPropertySchema: Schema<IBuyProperty> = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'users' },
    propertyType: { type: String,enum:["residential", "commercial", "land/plot"], default: null },
    taluka: { type: String, default: null },
    district: { type: String, default: null },
    audio: { type: String },
    descriptions: { type: String, default: null },
    isDeleted : { type: Boolean, default: false },
});

// Create the model
const BuyProperty: Model<IBuyProperty> = mongoose.model<IBuyProperty>('BuyProperty', buyPropertySchema, 'buyproperty');

export default BuyProperty;
