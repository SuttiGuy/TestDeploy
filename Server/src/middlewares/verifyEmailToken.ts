import BusinessModel from "../model/business.model";
import UserModel from "../model/user.model";
import AdminModel from "../model/admin.model";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

const verifyEmailToken = async (req: Request, res: Response) => {
  const { token } = req.query;
  const secret = process.env.SECRET as string;
  const client = process.env.CLIENT_URL as string;

  try {
    const decode: any = jwt.verify(token as string, secret);
    const role = decode.role;
    let verify: any;

    if (role === "user") {
      verify = await UserModel.findById(decode.userId);
    } else if (role === "business") {
      verify = await BusinessModel.findById(decode.userId);
    } else if (role === "admin") {
      verify = await AdminModel.findById(decode.userId);
    }

    if (!verify) {
      res.status(400).json({ error: "Verification failed" });
      return;
    }

    verify.isVerified = true;
    await verify.save();
    res.redirect(`${client}/verifySuccess/${token}`);
  } catch (error) {
    res.status(400).json({ error: "Token verification failed" });
  }
};

export default verifyEmailToken;
