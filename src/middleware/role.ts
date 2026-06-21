import { Request, Response, NextFunction } from "express";
import { UserRole } from "../models/userModel"; 

export const requireRole = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user; 

      if (!user) {
        return res.status(401).json({ message: "Unauthorized. No user found." });
      }

      const hasRole = user.roles.some((role: UserRole) => allowedRoles.includes(role));

      if (!hasRole) {
        return res.status(403).json({ 
          success: false,
          message: "Forbidden. You do not have permission to access this resource." 
        });
      }

      next();
      
    } catch (error) {
      res.status(500).json({ message: "Internal server error in role verification", error });
    }
  };
};