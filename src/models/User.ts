import mongoose from 'mongoose';
import { AuthProvider, UserRole } from '@/lib/types';

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
  provider: {
    type: String,
    enum: AuthProvider,
    default: AuthProvider.Github
  },
  githubId: {
    type: String
  },
  githubUsername: {
    type: String
  },
  googleId: {
    type: String
  },
  aiModel: {
    type: String,
    default: null
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
