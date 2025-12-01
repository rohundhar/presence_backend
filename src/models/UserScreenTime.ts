import mongoose, { Schema, Document } from 'mongoose';

export interface IUserScreenTime extends Document {
  userId: string;
  date: Date; // Normalized to Midnight
  bucketId: string;
  minutesSpent: number;
  lastSyncedAt: Date;
}

const UserScreenTimeSchema: Schema = new Schema({
  userId: { type: String, required: true, index: true },
  date: { type: Date, required: true, index: true },
  bucketId: { type: String, required: true },
  minutesSpent: { type: Number, default: 0 },
  lastSyncedAt: { type: Date, default: Date.now }
});

// Compound index to ensure uniqueness per bucket per day
UserScreenTimeSchema.index({ userId: 1, date: 1, bucketId: 1 }, { unique: true });

export default mongoose.model<IUserScreenTime>('UserScreenTime', UserScreenTimeSchema);