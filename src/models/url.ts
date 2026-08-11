import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUrl extends Document {
  urlCode: string;
  longUrl: string;
}

const urlSchema = new Schema<IUrl>({
  urlCode: { type: String, unique: true, required: true },
  longUrl: { type: String, required: true },
});

export const Url: Model<IUrl> = mongoose.model<IUrl>('Url', urlSchema);
