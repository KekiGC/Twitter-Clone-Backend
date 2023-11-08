import { Schema, model, Document } from "mongoose";
import { IUser } from "./user";
import { ILike } from "./like"

export interface ITweet extends Document {
  content: string;
  userId: IUser["_id"];
  isComment: boolean;
  parentTweetId: ITweet["_id"] | null;
  attachment: string | null;
  // likes: ILike["_id"] | null;
}

const tweetSchema = new Schema<ITweet>(
  {
    content: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isComment: {
      type: Boolean,
      default: false,
    },
    parentTweetId: {
      type: Schema.Types.ObjectId,
      ref: "Tweet",
      default: null,
    },
    attachment: {
      type: String,
      default: null,
    },
    // likes:{
    //   type: Schema.Types.ObjectId,
    //   ref: "Like",
    //   default: null,
    // }
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export default model<ITweet>("Tweet", tweetSchema);
