import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import UserModel from "../model/user.model";
import { sendEmail } from "../utils/sendEmail";
import BusinessModel from "../model/business.model";
import AdminModel from "../model/admin.model";

dotenv.config();

const getUserById = async (req: Request, res: Response): Promise<void> => {
  const userId = req.params.id;
  try {
    const userData = await UserModel.findById(userId);
    res.status(200).json(userData);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
const getBusinessById = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;
  try {
    const userData = await BusinessModel.findById(id); 
    res.status(200).json(userData);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const getAllUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userData = await UserModel.find();
    res.status(200).json(userData);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const getAllBusiness = async (req: Request, res: Response): Promise<void> => {
  try {
    const userData = await BusinessModel.find();
    res.status(200).json(userData);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const getAllAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const userData = await AdminModel.find();
    res.status(200).json(userData);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const userRegister = async (req: Request, res: Response): Promise<void> => {
  const salt = bcrypt.genSaltSync(10);
  const secret = process.env.SECRET as string;
  const userReq = req.body;
  const existingUser = await UserModel.findOne({ email: userReq.email });

  if (existingUser) {
    res.status(302).json({ message: "Email is already in use" });
  } else {
    if (userReq.password) {
      if (userReq.password.length < 8) {
        res
          .status(400)
          .json({ message: "Password must be at least 8 characters long" });
      } else {
        try {
          const user = await UserModel.create({
            name: userReq.name,
            lastName: userReq.lastName,
            email: userReq.email,
            password: bcrypt.hashSync(userReq.password, salt),
            phone: userReq.phone,
          });
          const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.role },
            secret,
            {
              expiresIn: "1h",
            }
          );
          await sendEmail(user.email, token);
          res.status(201).json(user);
        } catch (error) {
          console.log(error);
          res.status(400).json(error);
        }
      }
    } else if (!userReq.password) {
      const newUser = new UserModel(req.body);
      const savedUser = await newUser.save();
      res.status(201).json(savedUser);
    }
  }
};

const businessRegister = async (req: Request, res: Response): Promise<void> => {
  const salt = bcrypt.genSaltSync(10);
  const secret = process.env.SECRET as string;
  const userReq = req.body;
  const existingUser = await BusinessModel.findOne({ email: userReq.email });

  if (existingUser) {
    res.status(302).json({ message: "Email is already in use" });
  } else {
    if (userReq.password) {
      if (userReq.password.length < 8) {
        res
          .status(400)
          .json({ message: "Password must be at least 8 characters long" });
      } else {
        try {
          const user = await BusinessModel.create({
            businessName: userReq.businessName,
            email: userReq.email,
            password: bcrypt.hashSync(userReq.password, salt),
            phone: userReq.phone,
          });
          const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.role },
            secret,
            {
              expiresIn: "1h",
            }
          );
          await sendEmail(user.email, token);
          res.status(201).json(user);
        } catch (error) {
          console.log(error);
          res.status(400).json(error);
        }
      }
    } else if (!userReq.password) {
      const newUser = new BusinessModel(req.body);
      const savedUser = await newUser.save();
      res.status(201).json(savedUser);
    }
  }
};

const adminRegister = async (req: Request, res: Response): Promise<void> => {
  const salt = bcrypt.genSaltSync(10);
  const secret = process.env.SECRET as string;
  const { name, lastName, email, password, phone, role } = req.body;
  try {
    const user = await AdminModel.create({
      name,
      lastName,
      email,
      password: bcrypt.hashSync(password, salt),
      phone,
      role,
    });
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      secret,
      {
        expiresIn: "1h",
      }
    );
    await sendEmail(user.email, token);
    res.status(201).json(user);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

const updateUserAddress = async (req: Request, res: Response) => {
  const userId = req.params.id;
  const {address, role} = req.body;
  
  try {

    let updateData

    switch(role) {
      case "user":
        updateData = await UserModel.findByIdAndUpdate(
          userId,
          { $set: { address: address } },
          { new: true, runValidators: true }
        );
        break;
      case "business":
        updateData = await BusinessModel.findByIdAndUpdate(
          userId,
          { $set: { address: address } },
          { new: true, runValidators: true }
        );
        break;
      default:
        return res.status(404).json({ message: "Role not found" });
    }


    if (!updateData) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updateData);
  } catch (error) {
    console.error("Error updating address:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateUser = async (req: Request, res: Response) => {
  const userId = req.params.id;
  const updateData = req.body;
  const salt = bcrypt.genSaltSync(10);
  if (updateData.password) {
    updateData.password = bcrypt.hashSync(updateData.password, salt);
  }

  try {
    let updateResult;
    switch (updateData.role) {
      case "user":
        console.log(updateData.role);
        updateResult = await UserModel.findByIdAndUpdate(userId, updateData, {
          new: true,
        });
        console.log(updateResult?.name);
        break;
      case "business":
        console.log(updateData.role);
        updateResult = await BusinessModel.findByIdAndUpdate(userId, updateData, {
          new: true,
        });
        console.log(updateResult?.name);

        
        break;
      case "admin":
        updateResult = await AdminModel.findByIdAndUpdate(userId, updateData, {
          new: true,
        });
        break;
      default:
        return res.status(400).json({ message: "Invalid role specified" });
    }

    if (!updateResult) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updateResult);
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
};

const Login = async (req: Request, res: Response): Promise<void> => {
  const secret = process.env.SECRET as string;
  const { email, password, role } = req.body;

  const user = await UserModel.findOne({ email }).collation({
    locale: "en",
    strength: 2,
  }); //strength โดยพื้นฐานมี 4 ละดับการใช้ต่างกันขึ้นอยู่กับความเข้มงวด ระดับที่ 2 จะนับตัวเล็กตัวใหญ่ได้หมด
  const business = await BusinessModel.findOne({ email }).collation({
    locale: "en",
    strength: 2,
  });
  const admin = await AdminModel.findOne({ email }).collation({
    locale: "en",
    strength: 2,
  });

  let checkPasswordUser: boolean = false;
  let checkPasswordBusiness: boolean = false;
  let checkPasswordAdmin: boolean = false;
  let isPasswordValid: boolean = false;

  if (password) {
    const isMatchedPasswordUser = user
      ? bcrypt.compareSync(password, user.password)
      : false;
    const isMatchedPasswordBusiness = business
      ? bcrypt.compareSync(password, business.password)
      : false;
    const isMatchedPasswordAdmin = admin
      ? bcrypt.compareSync(password, admin.password)
      : false;

    checkPasswordUser = isMatchedPasswordUser;
    checkPasswordBusiness = isMatchedPasswordBusiness;
    checkPasswordAdmin = isMatchedPasswordAdmin;

    if (checkPasswordUser || checkPasswordBusiness || checkPasswordAdmin) {
      isPasswordValid = true;
    } else {
      isPasswordValid = false;
      res.status(400).json("pass isn't compareSync");
      return;
    }

    let userData: typeof user | typeof business | typeof admin | null = null;

    if (isPasswordValid) {
      if (role === "user") {
        userData = user;
      } else if (role === "business") {
        userData = business;
      } else if (role === "admin") {
        userData = admin;
      } else {
        res.status(400).json("role isn't compare");
        return;
      }
    } else {
      res.status(400).json("Isn't verify");
      return;
    }

    if (!userData) {
      res.status(400).json("No user-data");
      return;
    }

    if (userData) {
      jwt.sign({ email, id: userData._id, role }, secret, {}, (err: Error | null, token: string | undefined) => {
        if (err) throw err;
        res.cookie("token", token);
        const { password, ...userWithOutPassword } = userData.toObject();
        res.status(200).json({ ...userWithOutPassword });
      });
    } else {
      res.status(400).json("Wrong credentials");
    }
  } else {
    let userData: typeof user | typeof business | typeof admin | null = null;

    if (role === "user") {
      userData = user;
    } else if (role === "business") {
      userData = business;
    } else if (role === "admin") {
      userData = admin;
    } else {
      res.status(400).json("role isn't compare");
      return;
    }

    if (!userData) {
      res.status(400).json("No user-data");
      return;
    }

    if (!userData.password) {
      jwt.sign({ email, id: userData._id, role }, secret, {}, (err: Error | null, token: string | undefined) => {
        if (err) throw err;
        res.cookie("token", token);
        res.status(200).json(userData);
      });
    } else {
      res.status(400).json("Wrong credentials");
    }
  }
};

const checkEmailExists = async (req: Request, res: Response): Promise<void> => {
  const { email, role } = req.body;
  try {
    let userData;
    if (role === "user") {
      const user = await UserModel.findOne({ email });
      userData = user;
    } else if (role === "business") {
      const user = await BusinessModel.findOne({ email });
      userData = user;
    } else if (role === "admin") {
      const user = await AdminModel.findOne({ email });
      userData = user;
    }

    res.status(200).json(!!userData);
  } catch (error) {
    console.error("Error checking email existence:", error);
    throw new Error("Failed to check email existence");
  }
};

const Logout = (req: Request, res: Response): void => {
  res.clearCookie("token", { path: "/" });
  res.status(200).json({ message: "Successfully logged out" });
};

const ChangePassword = async (req: Request, res: Response) => {
  const { email, password, newPass, confirmPass } = req.body;
  if (email === "" || password === "" || newPass === "" || confirmPass === "") {
    return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบทุกช่อง" });
  }

  try {
    const userData = await UserModel.findOne({ email });
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }
    const isPasswordMatch = bcrypt.compareSync(password, userData.password);
    console.log(isPasswordMatch);

    if (!isPasswordMatch) {
      return res.status(401).json({ message: "รหัสผ่านปัจจุบันไม่ถูกต้อง" });
    }
    if (password === newPass || password === confirmPass) {
      return res.status(400).json({
        message: "กรุณากรอกรหัสผ่านใหม่ที่ไม่ตรงกับรหัสผ่านปัจจุบัน",
      });
    }
    if (newPass !== confirmPass) {
      return res.status(400).json({
        message:
          "รหัสผ่านใหม่และรหัสผ่านยืนยันไม่ตรงกัน กรุณาตรวจสอบและกรอกให้ตรงกัน",
      });
    }
    const salt = bcrypt.genSaltSync(10);
    const hashedNewPassword = bcrypt.hashSync(newPass, salt);

    // อัปเดตข้อมูลในฐานข้อมูล
    userData.password = hashedNewPassword;
    await userData.save();

    res.status(200).json({ message: "เปลี่ยนรหัสผ่านเรียบร้อยแล้ว", userData });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "ข้อผิดพลาดเซิร์ฟเวอร์ภายใน", error });
  }
};

export {
  updateUserAddress,
  businessRegister,
  checkEmailExists,
  getBusinessById,
  getAllBusiness,
  ChangePassword,
  adminRegister,
  userRegister,
  getAllAdmin,
  getUserById,
  updateUser,
  getAllUser,
  Logout,
  Login,
};
