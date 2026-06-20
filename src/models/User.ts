import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'buyer' | 'artisan' | 'admin';
  avatar?: string;
  profile?: {
    bio: string;
    story: string;
    location: string;
    website?: string;
    socialLinks?: { instagram?: string; etsy?: string };
    bannerImage?: string;
    specialties: string[];
    isVerified: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true, maxlength: 60 },
    email: { type: String, required: [true, 'Email is required'], unique: true, lowercase: true, match: [/^\S+@\S+\.\S+$/, 'Invalid email'] },
    password: { type: String, required: [true, 'Password is required'], minlength: 8, select: false },
    role: { type: String, enum: ['buyer', 'artisan', 'admin'], default: 'buyer' },
    avatar: { type: String },
    profile: {
      bio: { type: String, maxlength: 500 },
      story: { type: String, maxlength: 2000 },
      location: { type: String },
      website: { type: String },
      socialLinks: { instagram: String, etsy: String },
      bannerImage: { type: String },
      specialties: [{ type: String }],
      isVerified: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

UserSchema.pre('save', async function (this: IUser) {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

UserSchema.methods.comparePassword = async function (this: IUser, candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);
