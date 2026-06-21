import { Request, Response } from "express";
import { OrderModel } from "../models/orderModel";
import { PlantModel } from "../models/plantModel";
import { UserModel, UserRole } from "../models/userModel";

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const [totalOrders, totalPlants, totalUsers] = await Promise.all([
      OrderModel.countDocuments(),
      PlantModel.countDocuments(),
      UserModel.countDocuments({ roles: UserRole.USER }),
    ]);

    const revenueStats = await OrderModel.aggregate([
      {
        $facet: {
          totalRevenue: [
            { $group: { _id: null, sum: { $sum: "$totalAmount" } } }
          ],
          monthlyRevenue: [
            {
              $group: {
                _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                revenue: { $sum: "$totalAmount" },
                count: { $sum: 1 }
              }
            },
            { $sort: { _id: 1 } } 
          ]
        }
      }
    ]);

    const overallRevenue = revenueStats[0].totalRevenue[0]?.sum || 0;
    const monthlyData = revenueStats[0].monthlyRevenue;

    res.status(200).json({
      success: true,
      cardStats: {
        totalRevenue: overallRevenue,
        totalOrders,
        totalPlants,
        totalUsers
      },
      chartData: monthlyData
    });

  } catch (error: any) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch dashboard statistics", 
      error: error.message 
    });
  }
};