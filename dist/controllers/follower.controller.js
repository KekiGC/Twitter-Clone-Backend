"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFeed = exports.getFollowings = exports.getFollowers = exports.unfollowUser = exports.followUser = void 0;
const follower_1 = __importDefault(require("../models/follower"));
const user_1 = __importDefault(require("../models/user"));
const tweet_1 = __importDefault(require("../models/tweet"));
// Seguir a un usuario
const followUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { followerId, followingId } = req.body;
        const follower = new follower_1.default({
            followerId,
            followingId,
        });
        yield follower.save();
        res.json({ message: "Usuario seguido correctamente" });
    }
    catch (error) {
        res.status(500).json({ error: "Error al seguir al usuario" });
    }
});
exports.followUser = followUser;
// Dejar de seguir a un usuario
const unfollowUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { followerId, followingId } = req.body;
        yield follower_1.default.findOneAndDelete({ followerId, followingId }).exec();
        res.json({ message: "Dejaste de seguir al usuario correctamente" });
    }
    catch (error) {
        res.status(500).json({ error: "Error al dejar de seguir al usuario" });
    }
});
exports.unfollowUser = unfollowUser;
// Obtener los seguidores de un usuario
const getFollowers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const followers = yield follower_1.default.find({ followingId: userId }).exec();
        const followerIds = followers.map((follower) => follower.followerId);
        const followersData = yield user_1.default.find({ _id: { $in: followerIds } }).exec();
        res.json(followersData);
    }
    catch (error) {
        res.status(500).json({ error: "Error al obtener los seguidores" });
    }
});
exports.getFollowers = getFollowers;
// Obtener los seguidos de un usuario
const getFollowings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const followings = yield follower_1.default.find({ followerId: userId }).exec();
        const followingIds = followings.map((following) => following.followingId);
        const followingsData = yield user_1.default.find({ _id: { $in: followingIds } }).exec();
        res.json(followingsData);
    }
    catch (error) {
        res.status(500).json({ error: "Error al obtener los seguidos" });
    }
});
exports.getFollowings = getFollowings;
// Obtener los tweets de los seguidos de un usuario
const getFeed = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const followings = yield follower_1.default.find({ followerId: userId }).exec();
        const followingIds = followings.map((following) => following.followingId);
        const tweets = yield tweet_1.default.find({ userId: { $in: followingIds } }).populate('userId', 'username handle profileImg').sort({ createdAt: -1 }).exec();
        res.json(tweets);
    }
    catch (error) {
        res.status(500).json({ error: "Error al obtener los tweets" });
    }
});
exports.getFeed = getFeed;
