import { Request, Response } from "express";
import Tweet, { ITweet } from "../models/tweet";
import User, { IUser } from "../models/user";
import Like, { ILike } from "../models/like";


// crear un tweet
export const createTweet = async (req: Request, res: Response): Promise<Response> => {
  const { content, userId, isComment, parentTweetID, img } = req.body;
  const newTweet = new Tweet({ content, userId, isComment, parentTweetID, img });
  await newTweet.save();
  return res.status(201).json(newTweet);
};

// Obtener todos los tweets
export const getTweets = async (req: Request, res: Response) => {
  try {
    const tweets: ITweet[] = await Tweet.find().populate('userId', 'username handle profileImg');

    res.status(200).json(tweets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los tweets" });
  }
};

// Obtener los tweets de un usuario con información de usuario
export const getTweetsByUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const tweets: ITweet[] = await Tweet.find({ userId }).populate('userId', 'username handle profileImg');

    res.status(200).json(tweets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los tweets" });
  }
};

// Eliminar un tweet por su ID
export const deleteTweet = async (req: Request, res: Response) => {
  try {
    const { tweetId } = req.params;

    const deletedTweet = await Tweet.findByIdAndDelete(tweetId);

    if (!deletedTweet) {
      res.status(404).json({ message: "Tweet no encontrado" });
      return;
    }

    res.json({ message: "Tweet eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar el tweet" });
  }
};

// obtener un tweet por id
export const getTweetById = async (req: Request, res: Response) => {
  try {
    const { tweetId } = req.params;

    const tweet: ITweet | null = await Tweet.findById(tweetId);

    if (!tweet) {
      res.status(404).json({ message: 'Tweet not found' });
      return;
    }

    const user: IUser | null = await User.findById(tweet.userId);

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
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving tweet' });
  }
};

// dar like a un tweet
export const likeTweet = async (req: Request, res: Response): Promise<Response> => {
  const { userID, tweetID } = req.body;
  const newLike = new Like({ userId: userID, tweetId: tweetID });
  await newLike.save();
  return res.status(200).json(newLike);
};