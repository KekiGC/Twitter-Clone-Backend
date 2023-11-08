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
exports.likeTweet = exports.getTweetById = exports.deleteTweet = exports.getTweetsByUser = exports.getTweets = exports.createTweet = void 0;
const tweet_1 = __importDefault(require("../models/tweet"));
const user_1 = __importDefault(require("../models/user"));
const like_1 = __importDefault(require("../models/like"));
// crear un tweet
const createTweet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { content, userId, isComment, parentTweetID, img } = req.body;
    const newTweet = new tweet_1.default({ content, userId, isComment, parentTweetID, img });
    yield newTweet.save();
    return res.status(201).json(newTweet);
});
exports.createTweet = createTweet;
// Obtener todos los tweets
const getTweets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tweets = yield tweet_1.default.find().populate('userId', 'username handle profileImg');
        res.status(200).json(tweets);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener los tweets" });
    }
});
exports.getTweets = getTweets;
// Obtener los tweets de un usuario con información de usuario
const getTweetsByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const tweets = yield tweet_1.default.find({ userId }).populate('userId', 'username handle profileImg');
        res.status(200).json(tweets);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener los tweets" });
    }
});
exports.getTweetsByUser = getTweetsByUser;
// Eliminar un tweet por su ID
const deleteTweet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tweetId } = req.params;
        const deletedTweet = yield tweet_1.default.findByIdAndDelete(tweetId);
        if (!deletedTweet) {
            res.status(404).json({ message: "Tweet no encontrado" });
            return;
        }
        res.json({ message: "Tweet eliminado correctamente" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al eliminar el tweet" });
    }
});
exports.deleteTweet = deleteTweet;
// obtener un tweet por id
const getTweetById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tweetId } = req.params;
        const tweet = yield tweet_1.default.findById(tweetId);
        if (!tweet) {
            res.status(404).json({ message: 'Tweet not found' });
            return;
        }
        const user = yield user_1.default.findById(tweet.userId);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        const tweetWithUserInfo = {
            _id: tweet._id,
            content: tweet.content,
            user: {
                _id: user._id,
                username: user.username,
                handle: user.handle,
                profileImg: user.profileImg,
            }
        };
        res.json(tweetWithUserInfo);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving tweet' });
    }
});
exports.getTweetById = getTweetById;
// dar like a un tweet
const likeTweet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userID, tweetID } = req.body;
    const newLike = new like_1.default({ userId: userID, tweetId: tweetID });
    yield newLike.save();
    return res.status(200).json(newLike);
});
exports.likeTweet = likeTweet;
