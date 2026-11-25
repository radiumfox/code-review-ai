import mongoose from 'mongoose';
import { AuthProvider, UserRole } from '@/lib/types';
import { FREE_AI_MODELS } from '@/lib/config';

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
    enum: FREE_AI_MODELS,
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
