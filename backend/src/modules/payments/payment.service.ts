import { PaymentMode, PaymentStatus } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { ERROR_CODES } from "../../constants/error-codes";
import { AppError } from "../../core/errors/app-error";
import { prisma } from "../../database/prisma";
import { orderRepository } from "../orders/order.repository";
import { paymentRepository } from "./payment.repository";
import {
  ManualUpiMarkPaidInput,
  RazorpayCreateOrderInput,
  RazorpayVerifyInput
} from "./payment.types";

export const paymentService = {
  async createRazorpayOrder(input: RazorpayCreateOrderInput) {
    const order = await orderRepository.findById(input.orderId);
    if (!order) {
      throw new AppError("Order not found", StatusCodes.NOT_FOUND, ERROR_CODES.ORDER_NOT_FOUND);
    }

    const payment = await paymentRepository.updateByOrderId(order.id, {
      provider: "RAZORPAY",
      providerOrderId: `razorpay_${order.orderNumber}`
    });

    return {
      orderId: order.id,
      providerOrderId: payment.providerOrderId,
      amount: Number(payment.amount),
      currency: "INR"
    };
  },

  async verifyRazorpayPayment(input: RazorpayVerifyInput) {
    const order = await orderRepository.findById(input.orderId);
    if (!order) {
      throw new AppError("Order not found", StatusCodes.NOT_FOUND, ERROR_CODES.ORDER_NOT_FOUND);
    }

    return prisma.$transaction(async (tx) => {
      await paymentRepository.updateByOrderId(
        input.orderId,
        {
          provider: "RAZORPAY",
          providerOrderId: input.providerOrderId,
          providerPaymentId: input.providerPaymentId,
          providerSignature: input.providerSignature,
          paymentStatus: PaymentStatus.PAID,
          paidAt: new Date()
        },
        tx
      );

      await orderRepository.updateOrder(
        input.orderId,
        {
          paymentStatus: PaymentStatus.PAID,
          paymentMode: PaymentMode.RAZORPAY
        },
        tx
      );

      return { verified: true };
    });
  },

  async markManualUpiPaid(input: ManualUpiMarkPaidInput) {
    const order = await orderRepository.findById(input.orderId);
    if (!order) {
      throw new AppError("Order not found", StatusCodes.NOT_FOUND, ERROR_CODES.ORDER_NOT_FOUND);
    }

    return prisma.$transaction(async (tx) => {
      await paymentRepository.markPaid(input.orderId, "UPI_MANUAL", input.transactionReference, tx);
      await orderRepository.updateOrder(
        input.orderId,
        {
          paymentStatus: PaymentStatus.PAID,
          paymentMode: PaymentMode.UPI_MANUAL
        },
        tx
      );

      return { paid: true, transactionReference: input.transactionReference };
    });
  }
};
