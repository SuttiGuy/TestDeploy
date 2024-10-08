import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import UserModel from "../model/user.model";
import BusinessModel from "../model/business.model";
import AdminModel from "../model/admin.model";

interface DecodedToken {
  userId?: string;
  businessId?: string;
  adminId?: string;
}

export const authMiddleware = (role: "user" | "business" | "admin") => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    try {
      const secret = process.env.SECRET as string;
      const decoded = jwt.verify(token, secret) as DecodedToken;

      let user;
      if (role === "user") {
        user = await UserModel.findById(decoded.userId);
      } else if (role === "business") {
        user = await BusinessModel.findById(decoded.businessId);
      } else if (role === "admin") {
        user = await AdminModel.findById(decoded.adminId);
      }

      if (!user) {
        return res.status(403).json({ message: "Access denied" });
      }

      (req as any).user = user;

      next();
    } catch (error) {
      res.status(401).json({ message: "Invalid token" });
    }
  };
};
