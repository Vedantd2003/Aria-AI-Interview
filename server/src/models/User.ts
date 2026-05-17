import mongoose, { Document, Schema } from 'mongoose';

interface RefreshTokenEntry {
  hash: string;
  createdAt: Date;
  userAgent: string;
}

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  passwordHash?: string;
  googleId?: string;
  avatar?: string;
  resumeText?: string;
  refreshTokens: RefreshTokenEntry[];
  createdAt: Date;
  updatedAt: Date;
}

const RefreshTokenSchema = new Schema<RefreshTokenEntry>(
  {
    hash: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    userAgent: { type: String, default: '' },
  },
  { _id: false }
);

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String },
    googleId: { type: String, sparse: true },
    avatar: { type: String },
    resumeText: { type: String },
    refreshTokens: { type: [RefreshTokenSchema], default: [] },
  },
  { timestamps: true }
);

UserSchema.index({ email: 1 }, { unique: true });

export const User = mongoose.model<IUser>('User', UserSchema);
