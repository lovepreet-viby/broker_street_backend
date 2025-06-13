import mongoose, { Schema, Document } from 'mongoose';

interface ISubresourceUris extends Document {
  media: string;
}

interface IMessage extends Document {
  body: string;
  numSegments: string;
  direction: string;
  from: string;
  to: string;
  dateUpdated: Date;
  price: string | null;
  errorMessage: string | null;
  uri: string;
  accountSid: string;
  numMedia: string;
  status: string;
  messagingServiceSid: string | null;
  sid: string;
  dateSent: Date | null;
  dateCreated: Date;
  errorCode: string | null;
  priceUnit: string;
  apiVersion: string;
  subresourceUris: ISubresourceUris;
}

const SubresourceUrisSchema: Schema = new Schema({
  media: { type: String, required: true }
});

const MessageSchema: Schema<IMessage>= new Schema({
  body: { type: String, required: true },
  numSegments: { type: String, required: true },
  direction: { type: String, required: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  dateUpdated: { type: Date, required: true },
  price: { type: String, default: null },
  errorMessage: { type: String, default: null },
  uri: { type: String, required: true },
  accountSid: { type: String, required: true },
  numMedia: { type: String, required: true },
  status: { type: String, required: true },
  messagingServiceSid: { type: String, default: null },
  sid: { type: String, required: true },
  dateSent: { type: Date, default: null },
  dateCreated: { type: Date, required: true },
  errorCode: { type: String, default: null },
  priceUnit: { type: String, required: true },
  apiVersion: { type: String, required: true },
  subresourceUris: { type: SubresourceUrisSchema, required: true }
});

const Message = mongoose.model<IMessage>('Message', MessageSchema, "message");

export default Message;
