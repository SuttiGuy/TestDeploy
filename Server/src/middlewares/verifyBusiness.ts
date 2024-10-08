import { Request, Response, NextFunction } from "express";
import { CustomRequest } from "./verifyToken";

const verifyBusiness = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  // ตรวจสอบว่ามี decoded อยู่ใน request หรือไม่
  if (!req.decoded) {
    return res.status(401).send({ message: "Unauthorized Access" });
  }

  const role = req.decoded.role; // เข้าถึง role
  const isBusiness = role === "business"; // ตรวจสอบว่าเป็น business หรือไม่

  if (!isBusiness) {
    return res.status(403).send({ message: "Forbidden Access" });
  }

  next(); // ถ้าผ่านการตรวจสอบ ให้ดำเนินการต่อ
};

export default verifyBusiness;
