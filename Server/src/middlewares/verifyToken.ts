import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken"; // ไม่จำเป็นต้อง import JwtPayload

interface DecodedToken {
  userId: string;
  email: string;
  role: string;
  iat?: number; // issued at (optional, JWT standard field)
  exp?: number; // expiration time (optional, JWT standard field)
}

interface CustomRequest extends Request {
  decoded?: DecodedToken; 
}

const verifyToken = (req: CustomRequest, res: Response, next: NextFunction): void => {
  const token = req.cookies.token;
  const secret = process.env.SECRET as string;

  if (!token) {
    res.status(401).json("No token provided");
    return;
  }

  jwt.verify(token, secret, (err: Error | null, decoded: any) => {
    if (err) {
      console.error("Error verifying token:", err);
      res.status(401).json("Unauthorized");
    } else {
      req.decoded = decoded as DecodedToken; // แปลงประเภทของ decoded ให้เป็น DecodedToken
      next();
    }
  });
};

export { verifyToken, CustomRequest };
