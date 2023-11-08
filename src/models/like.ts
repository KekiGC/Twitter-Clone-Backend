import { Schema, model, Document } from "mongoose";
import { IUser } from "./user";
import { ITweet } from "./tweet";

export interface ILike extends Document {
  userId: IUser["_id"];
  tweetId: ITweet["_id"];
}

const likeSchema = new Schema<ILike>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tweetId: {
      type: Schema.Types.ObjectId,
      ref: "Tweet",
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

export default model<ILike>("Like", likeSchema);