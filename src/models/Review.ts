import mongoose from 'mongoose';
import { IssueSeverity, IssueCategory } from '@/lib/types';

const { Schema } = mongoose;

const REVIEW_COLLECTION_NAME = 'reviews';

const ReviewSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  language: {
    type: String,
    required: true
  },
  codeSnippet: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  issues: {
    type: [{
      line: {
        type: Number,
        required: true
      },
      severity: {
        type: String,
        enum: IssueSeverity,
        required: true
      },
      category: {
        type: String,
        enum: IssueCategory,
        required: true
      },
      message: {
        type: String,
        required: true
      },
      suggestion: {
        type: String,
        required: true
      }
    }],
    required: false
  }
}, {
  timestamps: true,
  collection: REVIEW_COLLECTION_NAME
});

export const ReviewModel = mongoose.models.Review || mongoose.model('Review', ReviewSchema);
