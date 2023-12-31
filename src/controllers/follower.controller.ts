import { Request, Response } from "express";
import Follower, { IFollower } from "../models/follower";
import User, { IUser } from "../models/user";
import Tweet, { ITweet } from "../models/tweet";

// Seguir o dejar de seguir a un usuario
export const followUser = async (req: Request, res: Response) => {
  try {
    const { followerId, followingId } = req.body;

    // Verificar si ya se está siguiendo al usuario
    const existingFollower = await Follower.findOneAndDelete({
      followerId,
      followingId,
    });

    if (existingFollower) {
      res.json({ message: "Dejaste de seguir al usuario" });
    } else {
      // Si no se está siguiendo, seguir al usuario
      const follower: IFollower = new Follower({
        followerId,
        followingId,
      });

      await follower.save();
      res.json({ message: "Usuario seguido correctamente" });
      console.log(follower)
    }
  } catch (error) {
    res.status(500).json({ error: "Error al seguir o dejar de seguir al usuario" });
  }
};

// Obtener los seguidores de un usuario
export const getFollowers = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const followers: IFollower[] = await Follower.find({ followingId: userId }).exec();

    const followerIds: IUser["_id"][] = followers.map((follower) => follower.followerId);

    const followersData: IUser[] = await User.find({ _id: { $in: followerIds } }).exec();

    res.json(followersData);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los seguidores" });
  }
};

// Obtener los seguidos de un usuario
export const getFollowings = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const followings: IFollower[] = await Follower.find({ followerId: userId }).exec();

    const followingIds: IUser["_id"][] = followings.map((following) => following.followingId);

    const followingsData: IUser[] = await User.find({ _id: { $in: followingIds } }).exec();

    res.json(followingsData);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los seguidos" });
  }
};

// Obtener los tweets de los seguidos de un usuario
export const getFeed = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const followings: IFollower[] = await Follower.find({ followerId: userId }).exec();

    const followingIds: IUser["_id"][] = followings.map((following) => following.followingId);

    const tweets: ITweet[] = await Tweet.find({ userId: { $in: followingIds } }).populate('userId', 'username handle profileImg').sort({ createdAt: -1 }).exec();

    res.json(tweets);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los tweets" });
  }
};