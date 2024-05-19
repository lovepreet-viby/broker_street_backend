import mongoose, { Document, Model, Schema ,ObjectId} from "mongoose";

// Define an interface for the BuyProperty document
interface IAssignSellProperty extends Document {
    userId:ObjectId;
    propertyId: ObjectId;
    propertyType: string;
    isDeleted: boolean;
}

// Define the schema
const assignSellPropertySchema: Schema<IAssignSellProperty> = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'users' },
    propertyId : { type: Schema.Types.ObjectId, required: true, ref: 'sellproperty' },
    propertyType: { type: String,enum:["residential", "commercial", "land/plot"], default: null },
    isDeleted : { type: Boolean, default: false },
});

const AssignSellProperty: Model<IAssignSellProperty> = mongoose.model<IAssignSellProperty>('AssignSellProperty', assignSellPropertySchema, 'assignsellproperty');

export default AssignSellProperty;
