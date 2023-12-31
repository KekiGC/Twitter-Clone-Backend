import { Schema, model, Document } from "mongoose";
import { IUser } from "./user";

export interface IFollower extends Document {
  followerId: IUser["_id"];
  followingId: IUser["_id"];
}

const followerSchema = new Schema(
  {
    followerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    followingId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

export default model<IFollower>("Follower", followerSchema);
