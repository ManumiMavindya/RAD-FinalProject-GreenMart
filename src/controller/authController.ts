import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { UserModel, UserRole } from "../models/userModel"; 
import { signAccessToken, signRefreshToken } from "../utils/tokens";

dotenv.config();
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const exUser = await UserModel.findOne({ email });
    if (exUser) {
      return res.status(400).json({ message: "User already exists..!" });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
      roles: [UserRole.USER]
    });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully..!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registration fail", error: err });
  }
};
 
// export const registerAdmin = async (req: Request, res: Response) => {
//   try {
//     const { name, email, password } = req.body;

//     const existingUser = await UserModel.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "Email exists" });
//     }

//     const hash = await bcrypt.hash(password, 10);

//     const user = await UserModel.create({
//       name,
//       email,
//       password: hash,
//       roles: [UserRole.ADMIN]
//     });

//     res.status(201).json({
//       message: "Admin registered successfully",
//       data: { email: user.email, roles: user.roles }
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials..!" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials..!" });
    }

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    res.status(200).json({
      message: "success",
      data: {
        email: user.email,
        roles: user.roles,
        accessToken,
        refreshToken
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login fail", error: err });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  try {
    if (!refreshToken) {
      return res.status(400).json({ message: "Token required..!" });
    }
    const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as any;
    const userId = payload.sub;
    
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    
    const newAccessToken = signAccessToken(user);
    res.status(200).json({
      message: "Token refreshed successfully",
      data: { accessToken: newAccessToken }
    });
  } catch (err) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
};