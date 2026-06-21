import { UserModel, UserRole } from "../models/userModel";
import bcrypt from "bcryptjs";

export const seedAdminAccount = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.log("[Admin Seed] ADMIN_EMAIL or ADMIN_PASSWORD missing in .env file!");
      return;
    }

    const adminExists = await UserModel.findOne({ email: adminEmail });

    if (!adminExists) {
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(adminPassword, salt);

      const superAdmin = new UserModel({
        name: "GreenMart Admin",
        email: adminEmail,
        password: hashedPassword,
        roles: [UserRole.ADMIN] 
      });

      await superAdmin.save();
      console.log("[Admin Seed] Permanent Admin Account Created Successfully!");
    } else {
      console.log("[Admin Seed] Permanent Admin Account Already Exists.");
    }
  } catch (error) {
    console.error("[Admin Seed] Failed to seed admin:", error);
  }
};