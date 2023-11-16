"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const tweet_controller_1 = require("../controllers/tweet.controller");
// crud tweets
router.post("/tweet", tweet_controller_1.createTweet);
router.get("/tweet", tweet_controller_1.getTweets);
router.put("/tweet/:tweetId", tweet_controller_1.editTweet);
router.delete("/tweet/:tweetId", tweet_controller_1.deleteTweet);
// gets
router.get("/tweet/user/:userId", tweet_controller_1.getTweetsByUser);
router.get("/tweet/:tweetId", tweet_controller_1.getTweetById);
router.get("/tweet/:tweetId/comments", tweet_controller_1.getParentTweetAndComments);
router.get("/tweets/filter", tweet_controller_1.getTweetsByFilter);
// likes
router.post("/tweet/:tweetId/like", tweet_controller_1.likeTweet);
router.get("/tweet/liked/:userId", tweet_controller_1.getTweetsLikedByUser);
// comments
router.post("/tweet/:tweetId/comment", tweet_controller_1.createTweetComment);
//router.get("/tweet/:tweetId/comments", getTweetComments);
exports.default = router;
