import { Response, Request } from "express";
import { AuthRequest } from "../middleware/auth";
import { OrderModel } from "../models/orderModel";
import { sendOrderConfirmationEmail } from "../utils/sendEmail"; 
import PDFDocument from "pdfkit";

export const placeOrder = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized! Please login first." });
    }

    const { customerName, shippingAddress, phone, items, totalAmount } = req.body;

    // readable invoice id generate
    const randomNumber = Math.floor(100000 + Math.random() * 900000);
    const currentYear = new Date().getFullYear();
    const uniqueInvoiceNumber = `INV-${currentYear}-${randomNumber}`;

    const newOrder = new OrderModel({
      invoiceNumber: uniqueInvoiceNumber,
      userId: req.user.sub, 
      customerName,
      shippingAddress,
      phone,
      items,
      totalAmount
    });

    const savedOrder = await newOrder.save();

    if (req.user && req.user.email) {
      sendOrderConfirmationEmail(req.user.email, savedOrder); 
  }

    res.status(201).json({
      message: "Order placed successfully..!",
      data: savedOrder
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to place order", error: err });
  }
};

export const getMyOrders = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const myOrders = await OrderModel.find({ userId: req.user.sub }).sort({ createdAt: -1 });

    res.status(200).json({ message: "ok", data: myOrders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch your orders" });
  }
};

export const getAllOrders = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized! Please login first." });
    }

    const orders = await OrderModel.find().sort({ createdAt: -1 });
    
    res.status(200).json({ message: "ok", data: orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch all orders" });
  }
};

export const cancelOrder = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;

    const order = await OrderModel.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found..!" });
    }

    if (order.userId.toString() !== req.user.sub) {
      return res.status(403).json({ message: "Forbidden! You can only cancel your own orders." });
    }

    if (order.status !== "Pending") {
      return res.status(400).json({ message: `Cannot cancel order! It is already ${order.status}.` });
    }

    order.status = "Cancelled";
    const updatedOrder = await order.save();

    res.status(200).json({ 
      message: "Order cancelled successfully..!", 
      data: updatedOrder 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to cancel order", error: err });
  }
};

export const updateOrderDetails = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params; 
    const { shippingAddress, phone } = req.body; 

    const order = await OrderModel.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found..!" });
    }

    if (order.userId.toString() !== req.user.sub) {
      return res.status(403).json({ message: "Forbidden! You can only update your own orders." });
    }

    if (order.status !== "Pending") {
      return res.status(400).json({ message: `Cannot update order details! It is already ${order.status}.` });
    }

    if (shippingAddress) order.shippingAddress = shippingAddress;
    if (phone) order.phone = phone;

    const updatedOrder = await order.save();

    res.status(200).json({ 
      message: "Order details updated successfully..!", 
      data: updatedOrder 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update order details", error: err });
  }
};

export const downloadInvoice = async (req: Request, res: Response) => {
  try {
    const orderId = req.params.id;

    const order = await OrderModel.findById(orderId).populate("items.plantId");

    if (!order) {
      return res.status(404).json({ message: "Order not found!" });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Invoice-${order.invoiceNumber}.pdf`
    );

    const doc = new PDFDocument({ margin: 50 });

    doc.pipe(res);

    doc.fillColor("#1b5e20").fontSize(28).text("GreenMart", 50, 50, { bold: true }); 
    doc.fillColor("#666666").fontSize(10).text("The Ultimate Plant Nursery", 50, 85);
    
    doc.fillColor("#333333").fontSize(11).text(`Invoice No: ${order.invoiceNumber}`, 350, 55, { align: "right" });
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 350, 70, { align: "right" });
    doc.text(`Status: ${order.status.toUpperCase()}`, 350, 85, { align: "right" });

    doc.moveTo(50, 110).lineTo(550, 110).strokeColor("#e0e0e0").stroke();

    doc.fillColor("#1b5e20").fontSize(12).text("BILL TO:", 50, 130, { bold: true });
    doc.fillColor("#424242").fontSize(10);
    doc.text(`Name      : ${order.customerName}`, 50, 150);
    doc.text(`Address   : ${order.shippingAddress}`, 50, 165);
    doc.text(`Phone     : ${order.phone}`, 50, 180);

    let currentY = 220;

    doc.rect(50, currentY, 500, 25).fill("#1b5e20");
    
    doc.fillColor("#ffffff").fontSize(10);
    doc.text("Item Name", 60, currentY + 7, { width: 250 });
    doc.text("Qty", 320, currentY + 7, { width: 50, align: "center" });
    doc.text("Unit Price", 390, currentY + 7, { width: 70, align: "right" });
    doc.text("Total (LKR)", 470, currentY + 7, { width: 70, align: "right" });

    currentY += 25; 

    order.items.forEach((item: any, index: number) => {
      if (index % 2 === 0) {
        doc.rect(50, currentY, 500, 22).fill("#f9f9f9");
      }

      doc.fillColor("#424242").fontSize(10);
      doc.text(item.name, 60, currentY + 6, { width: 250 });
      doc.text(item.quantity.toString(), 320, currentY + 6, { width: 50, align: "center" });
      doc.text(`Rs. ${item.price}.00`, 390, currentY + 6, { width: 70, align: "right" });
      doc.text(`Rs. ${item.quantity * item.price}.00`, 470, currentY + 6, { width: 70, align: "right" });

      currentY += 22;
    });

    doc.moveTo(50, currentY).lineTo(550, currentY).strokeColor("#1b5e20").stroke();
    currentY += 15;

    doc.fillColor("#1b5e20").fontSize(14).text(
      `Grand Total: LKR ${order.totalAmount}.00`, 
      300, 
      currentY, 
      { width: 250, align: "right", bold: true }
    );

    doc.moveTo(50, 700).lineTo(550, 700).strokeColor("#e0e0e0").stroke();
    doc.fillColor("#9e9e9e").fontSize(9).text(
      "Thank you for shopping with GreenMart! Come back soon.", 
      50, 
      715, 
      { align: "center" }
    );

    doc.end();

  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Failed to generate invoice PDF", error: error.message });
  }
};