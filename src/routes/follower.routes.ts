import { Router } from "express";
import {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowings,
  getFeed,
} from "../controllers/follower.controller";

const router = Router();

router.post("/follow", followUser);
router.post("/unfollow", unfollowUser);
router.get("/:userId/followers", getFollowers);
router.get("/:userId/followings", getFollowings);
router.get("/:userId/feed", getFeed);

export default router;