import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  userId: string; // From Auth Provider (e.g. Firebase/Auth0)
  name: string;
  email: string;
  teams: string[]; // Array of Team IDs (Strings) for fast lookup
}

const UserSchema: Schema = new Schema({
  userId: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  teams: [{ type: Schema.Types.ObjectId, ref: 'Team' }]
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);