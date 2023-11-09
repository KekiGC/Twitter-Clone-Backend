"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const follower_controller_1 = require("../controllers/follower.controller");
const router = (0, express_1.Router)();
router.post("/follow", follower_controller_1.followUser);
router.post("/unfollow", follower_controller_1.unfollowUser);
router.get("/:userId/followers", follower_controller_1.getFollowers);
router.get("/:userId/followings", follower_controller_1.getFollowings);
router.get("/:userId/feed", follower_controller_1.getFeed);
exports.default = router;
