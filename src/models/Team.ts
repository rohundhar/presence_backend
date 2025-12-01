import mongoose, { Schema, Document } from 'mongoose';

export interface ITeam extends Document {
  name: string;
  entryCode: string;
  createdBy: string; // userId
  members: string[]; // Array of userIds
}

const TeamSchema: Schema = new Schema({
  name: { type: String, required: true },
  entryCode: { type: String, required: true, unique: true, index: true },
  createdBy: { type: String, required: true },
  members: [{ type: String }] // Storing userId strings to avoid deep population issues
}, { timestamps: true });

export default mongoose.model<ITeam>('Team', TeamSchema);