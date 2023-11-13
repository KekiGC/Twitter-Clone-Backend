import { Router } from "express";
const router = Router();

import {
  createTweet,
  getTweets,
  getTweetsByUser,
  deleteTweet,
  getTweetById,
  likeTweet,
  editTweet,
  unlikeTweet,
  getTweetsLikedByUser,
  // getTweetComments,
  createTweetComment,
  getParentTweetAndComments
} from "../controllers/tweet.controller";

// crud tweets
router.post("/tweet", createTweet);
router.get("/tweet", getTweets);
router.put("/tweet/:tweetId", editTweet);
router.delete("/tweet/:tweetId", deleteTweet);

// gets
router.get("/tweet/user/:userId", getTweetsByUser);
router.get("/tweet/:tweetId", getTweetById);
router.get("/tweet/:tweetId/comments", getParentTweetAndComments);

// likes
router.post("/tweet/:tweetId/like", likeTweet);
router.delete("/tweet/:tweetId/unlike", unlikeTweet);
router.get("/tweet/liked/:userId", getTweetsLikedByUser);

// comments
router.post("/tweet/:tweetId/comment", createTweetComment);
//router.get("/tweet/:tweetId/comments", getTweetComments);


export default router;
