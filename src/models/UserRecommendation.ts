import mongoose, { Schema, Document } from 'mongoose';

export interface IBucketConfig {
  bucketId: string;        // "social", "games"
  displayName: string;     // "Social Media"
  appleSelectionToken: string; // Opaque token
  limit: number;           // Minutes
  warningLimit: number;    // Minutes
  isBlockingEnabled: boolean;
}

export interface IUserRecommendation extends Document {
  userId: string;
  monitoredBuckets: IBucketConfig[];
}

const UserRecommendationSchema: Schema = new Schema({
  userId: { type: String, required: true, unique: true, index: true },
  monitoredBuckets: [{
    bucketId: { type: String, required: true },
    displayName: { type: String, required: true },
    appleSelectionToken: { type: String, select: false }, // Hidden by default for security
    limit: { type: Number, default: 60 },
    warningLimit: { type: Number, default: 45 },
    isBlockingEnabled: { type: Boolean, default: true }
  }]
}, { timestamps: true });

export default mongoose.model<IUserRecommendation>('UserRecommendation', UserRecommendationSchema);