import { Request, Response } from "express";
import Tweet, { ITweet } from "../models/tweet";
import User, { IUser } from "../models/user";
import Like, { ILike } from "../models/like";


// crear un tweet
export const createTweet = async (req: Request, res: Response): Promise<Response> => {
  const { content, userId, isComment, parentTweetID, attachment } = req.body;
  const newTweet = new Tweet({ content, userId, isComment, parentTweetID, attachment });
  await newTweet.save();
  return res.status(201).json(newTweet);
};

// Obtener todos los tweets
export const getTweets = async (req: Request, res: Response) => {
  try {
    const tweets: ITweet[] = await Tweet.find({ isComment: false })
    .populate('userId', 'username profileImg')
    .sort({ createdAt: -1 }).exec();

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

    const tweets: ITweet[] = await Tweet.find({ userId })
    .populate('userId', 'username handle profileImg');

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
    
    const tweet: ITweet | null = await Tweet.findById(tweetId)
    .populate('userId', 'username profileImg')
    .exec();
    
    if (!tweet) {
      res.status(404).json({ message: 'Tweet not found' });
      return;
    }
    
    // const user: IUser | null = await User.findById(tweet.userId);

    // if (!user) {
    //   res.status(404).json({ message: 'User not found' });
    //   return;
    // }

    // const tweetWithUserInfo = {
    //   _id: tweet._id,
    //   content: tweet.content,
    //   attachment: tweet.attachment,
    //   user: {
    //     _id: user._id,
    //     username: user.username,
    //     profileImg: user.profileImg,
    //   }
    // };

    res.status(200).json(tweet);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving tweet' });
  }
};

// dar like a un tweet
export const likeTweet = async (req: Request, res: Response) => {
  try {
    const { tweetId } = req.params;
    const { userId } = req.body;

    const tweet: ITweet | null = await Tweet.findById(tweetId);

    if (!tweet) {
      return res.status(404).json({ message: 'Tweet not found' });
    }

    const existingLike: ILike | null = await Like.findOne({ tweetId, userId });

    if (existingLike) {
      await Like.findByIdAndDelete(existingLike._id);
      return res.status(200).json({ message: 'Tweet unliked successfully' })
    }

    // Crear un nuevo like
    const like = new Like({ tweetId, userId });
    await like.save();

    return res.status(200).json(like);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error liking the tweet' });
  }
};


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
export const createTweetComment = async (req: Request, res: Response) => {
  try {
    const { tweetId } = req.params;
    const { content, userId } = req.body;

    const parentTweet = await Tweet.findById(tweetId).exec();
    if (!parentTweet) {
      return res.status(404).json({ error: "Tweet no encontrado" });
    }

    const comment: ITweet = new Tweet({
      content,
      userId,
      isComment: true,
      parentTweetId: parentTweet._id,
    });

    await comment.save();

    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el comentario" });
  }
};

// Obtener los tweets que le gustan a un usuario
export const getTweetsLikedByUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    // Obtener los IDs de los tweets que le dio like el usuario
    const likedTweets: ILike[] = await Like.find({ userId }).exec();
    const likedTweetIds: string[] = likedTweets.map((like) => like.tweetId);

    // Obtener los tweets que tienen los IDs encontrados
    const tweets: ITweet[] = await Tweet.find({ _id: { $in: likedTweetIds } })
    .populate('userId', 'username handle profileImg').sort({ createdAt: -1 }).exec();

    res.status(200).json(tweets);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los tweets que le dio like el usuario" });
  }
};

// editar un tweet
export const editTweet = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { tweetID } = req.params;
    const { newData } = req.body;
    const tweet = await Tweet.findById(tweetID);
    if (!tweet) {
      return res.status(404).json({ message: 'Tweet not found' });
    }
    tweet.content = newData.content || tweet.content;
    const updatedTweet = await tweet.save();
    return res.status(200).json(updatedTweet);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error editing the tweet' });
  }
};

// obtener el parentTweet y sus comentarios
export const getParentTweetAndComments = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { tweetId } = req.params;
    const parentTweet = await Tweet.findById(tweetId);
    console.log(parentTweet);
    if (!parentTweet) {
      return res.status(404).json({ message: 'Tweet not found' });
    }
    const comments = await Tweet.find({ parentTweetId: tweetId, isComment: true });
    return res.status(200).json({ parentTweet, comments });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error getting the tweet and comments' });
  }
};

// obtener los tweets filtrados
export const getTweetsByFilter = async (req: Request, res: Response) => {
  try {
    const { sortOrder } = req.query;

    let sortQuery: any = {};

    if (sortOrder === "recent") {
      sortQuery = { createdAt: -1 };
    } else if (sortOrder === "oldest") {
      sortQuery = { createdAt: 1 };
    } else if (sortOrder === "mostLikes") {
      sortQuery = { likesCount: -1 };
    } else if (sortOrder === "leastLikes") {
      sortQuery = { likesCount: 1 };
    }

    const tweets: ITweet[] = await Tweet.aggregate([
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los tweets" });
  }
};