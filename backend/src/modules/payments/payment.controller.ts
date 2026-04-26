import { Request, Response } from "express";
import { sendSuccess } from "../../core/http/response";
import { paymentService } from "./payment.service";

export const paymentController = {
  async createRazorpayOrder(req: Request, res: Response) {
    const data = await paymentService.createRazorpayOrder(req.body);
    return sendSuccess(res, "Razorpay order created successfully", data);
  },
  async verifyRazorpayPayment(req: Request, res: Response) {
    const data = await paymentService.verifyRazorpayPayment(req.body);
    return sendSuccess(res, "Razorpay payment verified successfully", data);
  },
  async markManualUpiPaid(req: Request, res: Response) {
    const data = await paymentService.markManualUpiPaid(req.body);
    return sendSuccess(res, "Manual UPI payment marked successfully", data);
  }
};
