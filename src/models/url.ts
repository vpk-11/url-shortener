import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUrl extends Document {
  urlCode: string;
  longUrl: string;
  shortUrl: string;
  date: Date;
}

const urlSchema = new Schema<IUrl>({
  urlCode: { type: String, unique: true, required: true },
  longUrl: { type: String, required: true },
  shortUrl: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

export const Url: Model<IUrl> = mongoose.model<IUrl>('Url', urlSchema);
