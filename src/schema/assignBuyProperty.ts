import mongoose, { Document, Model, Schema ,ObjectId} from "mongoose";

// Define an interface for the BuyProperty document
interface IAssignBuyProperty extends Document {
    userId:ObjectId;
    propertyId: ObjectId;
    propertyType: string;
    isDeleted: boolean;
}

// Define the schema
const assignBuyPropertySchema: Schema<IAssignBuyProperty> = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'users' },
    propertyId : { type: Schema.Types.ObjectId, required: true, ref: 'buyproperty' },
    propertyType: { type: String,enum:["residential", "commercial", "land/plot"], default: null },
    isDeleted : { type: Boolean, default: false },
});

const AssignBuyProperty: Model<IAssignBuyProperty> = mongoose.model<IAssignBuyProperty>('AssignBuyProperty', assignBuyPropertySchema, 'assignbuyproperty');

export default AssignBuyProperty;
