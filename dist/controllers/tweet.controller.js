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
exports.getTweetsByFilter = exports.getParentTweetAndComments = exports.editTweet = exports.getTweetsLikedByUser = exports.createTweetComment = exports.likeTweet = exports.getTweetById = exports.deleteTweet = exports.getTweetsByUser = exports.getTweets = exports.createTweet = void 0;
const tweet_1 = __importDefault(require("../models/tweet"));
const user_1 = __importDefault(require("../models/user"));
const like_1 = __importDefault(require("../models/like"));
// crear un tweet
const createTweet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { content, userId, isComment, parentTweetID, attachment } = req.body;
    const newTweet = new tweet_1.default({ content, userId, isComment, parentTweetID, attachment });
    yield newTweet.save();
    return res.status(201).json(newTweet);
});
exports.createTweet = createTweet;
// Obtener todos los tweets
const getTweets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tweets = yield tweet_1.default.find({ isComment: false })
            .populate('userId', 'username profileImg')
            .sort({ createdAt: -1 }).exec();
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
        const tweets = yield tweet_1.default.find({ userId })
            .populate('userId', 'username handle profileImg');
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
    try {
        const { tweetId } = req.params;
        const { userId } = req.body;
        const tweet = yield tweet_1.default.findById(tweetId);
        if (!tweet) {
            return res.status(404).json({ message: 'Tweet not found' });
        }
        const existingLike = yield like_1.default.findOne({ tweetId, userId });
        if (existingLike) {
            yield like_1.default.findByIdAndDelete(existingLike._id);
            return res.status(200).json({ message: 'Tweet unliked successfully' });
        }
        // Crear un nuevo like
        const like = new like_1.default({ tweetId, userId });
        yield like.save();
        return res.status(200).json(like);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error liking the tweet' });
    }
});
exports.likeTweet = likeTweet;
// Obtener comentarios de un tweet
// export const getTweetComments = async (req: Request, res: Response) => {
//   try {
//     const { tweetId } = req.params;
//     const comments = await Tweet.find({ parentTweetId: tweetId, isComment: true }).sort({ createdAt: -1 }).exec();
//     res.json(comments);
//   } catch (error) {
//     res.status(500).json({ error: "Error al obtener los comentarios del tweet" });
//   }
// };
// Crear un comentario de un tweet
const createTweetComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tweetId } = req.params;
        const { content, userId } = req.body;
        const parentTweet = yield tweet_1.default.findById(tweetId).exec();
        if (!parentTweet) {
            return res.status(404).json({ error: "Tweet no encontrado" });
        }
        const comment = new tweet_1.default({
            content,
            userId,
            isComment: true,
            parentTweetId: parentTweet._id,
        });
        yield comment.save();
        res.json(comment);
    }
    catch (error) {
        res.status(500).json({ error: "Error al crear el comentario" });
    }
});
exports.createTweetComment = createTweetComment;
// Obtener los tweets que le gustan a un usuario
const getTweetsLikedByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        // Obtener los IDs de los tweets que le dio like el usuario
        const likedTweets = yield like_1.default.find({ userId }).exec();
        const likedTweetIds = likedTweets.map((like) => like.tweetId);
        // Obtener los tweets que tienen los IDs encontrados
        const tweets = yield tweet_1.default.find({ _id: { $in: likedTweetIds } })
            .populate('userId', 'username handle profileImg').sort({ createdAt: -1 }).exec();
        res.status(200).json(tweets);
    }
    catch (error) {
        res.status(500).json({ error: "Error al obtener los tweets que le dio like el usuario" });
    }
});
exports.getTweetsLikedByUser = getTweetsLikedByUser;
// editar un tweet
const editTweet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tweetID } = req.params;
        const { newData } = req.body;
        const tweet = yield tweet_1.default.findById(tweetID);
        if (!tweet) {
            return res.status(404).json({ message: 'Tweet not found' });
        }
        tweet.content = newData.content || tweet.content;
        const updatedTweet = yield tweet.save();
        return res.status(200).json(updatedTweet);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error editing the tweet' });
    }
});
exports.editTweet = editTweet;
// obtener el parentTweet y sus comentarios
const getParentTweetAndComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tweetId } = req.params;
        const parentTweet = yield tweet_1.default.findById(tweetId);
        console.log(parentTweet);
        if (!parentTweet) {
            return res.status(404).json({ message: 'Tweet not found' });
        }
        const comments = yield tweet_1.default.find({ parentTweetId: tweetId, isComment: true });
        return res.status(200).json({ parentTweet, comments });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error getting the tweet and comments' });
    }
});
exports.getParentTweetAndComments = getParentTweetAndComments;
// obtener los tweets filtrados
const getTweetsByFilter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sortOrder } = req.query;
        let sortQuery = {};
        if (sortOrder === "recent") {
            sortQuery = { createdAt: -1 };
        }
        else if (sortOrder === "oldest") {
            sortQuery = { createdAt: 1 };
        }
        else if (sortOrder === "mostLikes") {
            sortQuery = { likesCount: -1 };
        }
        else if (sortOrder === "leastLikes") {
            sortQuery = { likesCount: 1 };
        }
        const tweets = yield tweet_1.default.aggregate([
            {
                $match: { isComment: false },
            },
            {
                $lookup: {
                    from: "likes",
                    localField: "_id",
                    foreignField: "tweetId",
                    as: "likes",
                },
            },
            {
                $addFields: {
                    likesCount: { $size: "$likes" },
                },
            },
            {
                $sort: sortQuery,
            },
        ]);
        res.status(200).json(tweets);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener los tweets" });
    }
});
exports.getTweetsByFilter = getTweetsByFilter;
