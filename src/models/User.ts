import mongoose from 'mongoose';
import { UserRole } from '@/lib/types';

const { Schema } = mongoose;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  githubId: {
    type: String,
    required: true
  },
  githubUsername: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: UserRole,
    required: true
  }
}, {
  timestamps: true,
  collection: 'users'
});

export const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);
