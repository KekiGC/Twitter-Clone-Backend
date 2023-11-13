import { model, Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  email: string;
  username: string;
  password: string;
  name: string;
  lastname: string;
  bio: string | null;
  profileImg: string | null;
  comparePassword: (password: string) => Promise<boolean>;
  editProfile: (username: string, bio: string) => Promise<void>;
}

const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    lastname: {
      type: String,
      required: true,
      trim: true,
    },
    bio: {
      type: String,
      required: false,
      trim: true,
    },
    profileImg: {
      type: String,
      required: false,
      trim: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

userSchema.pre<IUser>("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(user.password, salt);
  user.password = hash;
  next();
});

userSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.editProfile = async function (
  username: string,
  bio: string
): Promise<void> {
  this.username = username;
  this.bio = bio;
  await this.save();
};

export default model<IUser>("User", userSchema);
