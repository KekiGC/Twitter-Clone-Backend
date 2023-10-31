import { Request, Response } from "express";
import User, { IUser } from "../models/user";
import jwt from "jsonwebtoken";
import config from "../config/config";

function createToken(user: IUser) {
  return jwt.sign({ id: user.id, email: user.email }, config.jwtSecret, {
    expiresIn: 86400,
  });
}

export const signUp = async (
  req: Request,
  res: Response
): Promise<Response> => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ msg: "Plase. Send your email and password" });
  }

  const user = await User.findOne({ email: req.body.email });
  console.log(user);
  if (user) {
    return res.status(400).json({ msg: "The user already exist" });
  }

  const newUser = new User(req.body);
  await newUser.save();

  return res.status(201).json(newUser);
};

export const signIn = async (req: Request, res: Response) => {
    console.log(req.body)
    if (!req.body.email && !req.body.username || !req.body.password) {
      return res.status(400).json({ msg: 'Please send your email/username and password' });
    }
  
    let user;
    if (req.body.email) {
      user = await User.findOne({ email: req.body.email });
    } else if (req.body.username) {
      user = await User.findOne({ username: req.body.username });
    }
  
    if (!user) {
      return res.status(400).json({ msg: 'The user does not exist' });
    }
  
    const isMatch = await user.comparePassword(req.body.password);
    if (isMatch) {
      const token = createToken(user);
      const userID = user._id; // Obtener el userID del usuario
      return res.status(200).json({ token, userID });
    }
  
    return res.status(400).json({
      msg: 'The email/username or password are incorrect',
    });
  };
