import { Router } from "express";
import {
  followUser,
  getFollowers,
  getFollowings,
  getFeed,
} from "../controllers/follower.controller";

const router = Router();

router.post("/follow", followUser);
router.get("/:userId/followers", getFollowers);
router.get("/:userId/followings", getFollowings);
router.get("/:userId/feed", getFeed);

export default router;