import { OrderStatus } from "@prisma/client";
import { Request, Response } from "express";
import { sendSuccess } from "../../core/http/response";
import { getOptionalParam, getParam } from "../../core/utils/request";
import { orderService } from "./order.service";

export const orderController = {
  async place(req: Request, res: Response) {
    const data = await orderService.place(req.authUser!.userId, req.body);
    return sendSuccess(res, "Order placed successfully", data);
  },
  async myOrders(req: Request, res: Response) {
    const data = await orderService.myOrders(
      req.authUser!.userId,
      getOptionalParam(req.query.status) as OrderStatus | undefined
    );
    return sendSuccess(res, "Orders fetched successfully", data);
  },
  async details(req: Request, res: Response) {
    const data = await orderService.customerDetails(req.authUser!.userId, getParam(req.params.orderId));
    return sendSuccess(res, "Order fetched successfully", data);
  },
  async cancelByCustomer(req: Request, res: Response) {
    const data = await orderService.cancelByCustomer(
      req.authUser!.userId,
      getParam(req.params.orderId),
      req.body.reason
    );
    return sendSuccess(res, "Order cancelled successfully", data);
  },
  async listShopOrders(req: Request, res: Response) {
    const data = await orderService.listShopOrders(
      req.authUser!.userId,
      req.authUser!.role,
      getParam(req.params.shopId)
    );
    return sendSuccess(res, "Shop orders fetched successfully", data);
  },
  async shopDetails(req: Request, res: Response) {
    const data = await orderService.shopDetails(
      req.authUser!.userId,
      req.authUser!.role,
      getParam(req.params.orderId)
    );
    return sendSuccess(res, "Shop order fetched successfully", data);
  },
  async confirm(req: Request, res: Response) {
    const data = await orderService.shopUpdateStatus(
      req.authUser!.userId,
      req.authUser!.role,
      getParam(req.params.orderId),
      OrderStatus.ACCEPTED
    );
    return sendSuccess(res, "Order accepted successfully", data);
  },
  async readyForPickup(req: Request, res: Response) {
    const data = await orderService.shopUpdateStatus(
      req.authUser!.userId,
      req.authUser!.role,
      getParam(req.params.orderId),
      OrderStatus.READY_FOR_PICKUP
    );
    return sendSuccess(res, "Order ready for pickup", data);
  },
  async cancelByShop(req: Request, res: Response) {
    const data = await orderService.cancelByShop(
      req.authUser!.userId,
      req.authUser!.role,
      getParam(req.params.orderId),
      req.body.reason
    );
    return sendSuccess(res, "Order cancelled successfully", data);
  },
  async assignCaptain(req: Request, res: Response) {
    const data = await orderService.assignCaptain(
      req.authUser!.userId,
      req.authUser!.role,
      getParam(req.params.orderId),
      req.body.captainId
    );
    return sendSuccess(res, "Captain assigned successfully", data);
  },
  async adminOrders(_req: Request, res: Response) {
    const data = await orderService.adminOrders();
    return sendSuccess(res, "Admin orders fetched successfully", data);
  },
  async adminDetails(req: Request, res: Response) {
    const data = await orderService.adminDetails(getParam(req.params.orderId));
    return sendSuccess(res, "Admin order fetched successfully", data);
  },
  async adminUpdateStatus(req: Request, res: Response) {
    const data = await orderService.adminUpdateStatus(
      req.authUser!.userId,
      getParam(req.params.orderId),
      req.body.status,
      req.body.remarks
    );
    return sendSuccess(res, "Order status updated successfully", data);
  },
  async adminAccept(req: Request, res: Response) {
    const data = await orderService.adminAccept(req.authUser!.userId, getParam(req.params.orderId));
    return sendSuccess(res, "Order accepted successfully", data);
  },
  async adminReadyForPickup(req: Request, res: Response) {
    const data = await orderService.adminReadyForPickup(req.authUser!.userId, getParam(req.params.orderId));
    return sendSuccess(res, "Order ready for pickup", data);
  },
  async availableCaptains(_req: Request, res: Response) {
    const data = await orderService.availableCaptains();
    return sendSuccess(res, "Available captains fetched successfully", data);
  },
  async captainAvailableOrders(req: Request, res: Response) {
    const data = await orderService.captainAvailableOrders(req.authUser!.userId);
    return sendSuccess(res, "Available captain orders fetched successfully", data);
  },
  async captainActiveOrders(req: Request, res: Response) {
    const data = await orderService.captainActiveOrders(req.authUser!.userId);
    return sendSuccess(res, "Active captain orders fetched successfully", data);
  },
  async captainOrders(req: Request, res: Response) {
    const data = await orderService.captainOrders(req.authUser!.userId);
    return sendSuccess(res, "Captain orders fetched successfully", data);
  },
  async captainAccept(req: Request, res: Response) {
    const data = await orderService.captainAcceptAvailableOrder(req.authUser!.userId, getParam(req.params.orderId));
    return sendSuccess(res, "Order accepted successfully", data);
  },
  async captainReject(req: Request, res: Response) {
    const data = await orderService.captainReject(
      req.authUser!.userId,
      getParam(req.params.orderId),
      req.body.reason
    );
    return sendSuccess(res, "Order rejected successfully", data);
  },
  async captainPickedUp(req: Request, res: Response) {
    const data = await orderService.captainPickedUpDelivery(
      req.authUser!.userId,
      getParam(req.params.orderId)
    );
    return sendSuccess(res, "Order picked up successfully", data);
  },
  async captainDeliver(req: Request, res: Response) {
    const data = await orderService.captainDeliveredOrder(req.authUser!.userId, getParam(req.params.orderId));
    return sendSuccess(res, "Order delivered successfully", data);
  }
};
