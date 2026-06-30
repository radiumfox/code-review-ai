import mongoose from 'mongoose';

const { Schema } = mongoose;

const REVIEW_COLLECTION_NAME = 'reviews';

enum IssueSeverity {
    Error = 'error',
    Warning = 'warning',
    Suggestion = 'suggestion'
}

enum IssueCategory {
    Bug = 'bug',
    Style = 'style',
    Performance = 'performance',
    Security = 'security'
}

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
  issues: [{
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
  }]
}, {
  timestamps: true,
  collection: REVIEW_COLLECTION_NAME
});

export const ReviewModel = mongoose.models.Review || mongoose.model('Review', ReviewSchema);
