import mongoose, { Document, Model, Schema ,ObjectId} from "mongoose";

// Define an interface for the BuyProperty document
interface IAssignProperty extends Document {
    userId:ObjectId;
    propertyId: ObjectId;
    propertyType: string;
    isDeleted: boolean;
}

// Define the schema
const assignPropertySchema: Schema<IAssignProperty> = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'users' },
    propertyId : { type: Schema.Types.ObjectId, required: true, ref: 'sellproperty' },
    propertyType: { type: String,enum:["residential", "commercial", "land/plot"], default: null },
    isDeleted : { type: Boolean, default: false },
});

const AssignProperty: Model<IAssignProperty> = mongoose.model<IAssignProperty>('AssignProperty', assignPropertySchema, 'assignproperty');

export default AssignProperty;
