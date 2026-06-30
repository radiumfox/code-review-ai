import mongoose from "mongoose";

const { Schema } = mongoose;

export enum UserRole {
    Admin = 'admin',
    User = 'user'
}

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
}, { timestamps: true, collection: 'users' });

export const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);
