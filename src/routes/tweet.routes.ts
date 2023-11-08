import { Router } from "express";
const router = Router();

import { createTweet, getTweets, getTweetsByUser, deleteTweet, getTweetById } from "../controllers/tweet.controller";

router.post('/tweet', createTweet)
router.get('/tweet', getTweets)
router.get('/tweet/user/:userId', getTweetsByUser)
router.get('/tweet/:tweetId', getTweetById)
router.delete('/tweet/:tweetId', deleteTweet)

export default router;