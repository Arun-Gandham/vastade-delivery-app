import { NextFunction, Request, Response } from "express";
import { sendSuccess } from "../../core/http/response";
import { getParam } from "../../core/utils/request";
import { deliveryTaskRepository } from "./delivery-task.repository";
import { deliveryTaskService } from "./delivery-task.service";

export const deliveryTaskController = {
  async captainTasks(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await deliveryTaskService.listCaptainTasks(req.authUser!.userId);
      return sendSuccess(res, "Captain tasks fetched successfully", data);
    } catch (error) {
      return next(error);
    }
  },
  async accept(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await deliveryTaskService.captainAccept(req.authUser!.userId, getParam(req.params.taskId));
      return sendSuccess(res, "Delivery task accepted successfully", data);
    } catch (error) {
      return next(error);
    }
  },
  async reject(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await deliveryTaskService.captainReject(req.authUser!.userId, getParam(req.params.taskId), req.body);
      return sendSuccess(res, "Delivery task rejected successfully", data);
    } catch (error) {
      return next(error);
    }
  },
  async reachedPickup(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await deliveryTaskService.captainReachedPickup(req.authUser!.userId, getParam(req.params.taskId));
      return sendSuccess(res, "Captain reached pickup successfully", data);
    } catch (error) {
      return next(error);
    }
  },
  async pickedUp(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await deliveryTaskService.captainPickedUp(req.authUser!.userId, getParam(req.params.taskId));
      return sendSuccess(res, "Task picked up successfully", data);
    } catch (error) {
      return next(error);
    }
  },
  async reachedDrop(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await deliveryTaskService.captainReachedDrop(req.authUser!.userId, getParam(req.params.taskId));
      return sendSuccess(res, "Captain reached drop successfully", data);
    } catch (error) {
      return next(error);
    }
  },
  async delivered(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await deliveryTaskService.captainDelivered(req.authUser!.userId, getParam(req.params.taskId));
      return sendSuccess(res, "Delivery task marked delivered successfully", data);
    } catch (error) {
      return next(error);
    }
  },
  async failed(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await deliveryTaskService.captainFailed(req.authUser!.userId, getParam(req.params.taskId));
      return sendSuccess(res, "Delivery task marked failed successfully", data);
    } catch (error) {
      return next(error);
    }
  },
  async adminList(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await deliveryTaskService.adminListTasks();
      return sendSuccess(res, "Delivery tasks fetched successfully", data);
    } catch (error) {
      return next(error);
    }
  },
  async adminDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await deliveryTaskService.adminTaskDetails(getParam(req.params.id));
      return sendSuccess(res, "Delivery task fetched successfully", data);
    } catch (error) {
      return next(error);
    }
  },
  async shopOrderDelivery(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await deliveryTaskService.shopOrderDelivery(getParam(req.params.orderId));
      return sendSuccess(res, "Order delivery details fetched successfully", data);
    } catch (error) {
      return next(error);
    }
  },
  async shopTaskDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await deliveryTaskService.adminTaskDetails(getParam(req.params.taskId));
      return sendSuccess(res, "Shop delivery task fetched successfully", data);
    } catch (error) {
      return next(error);
    }
  },
  async shopTaskTracking(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await deliveryTaskService.shopTaskTracking(getParam(req.params.taskId));
      return sendSuccess(res, "Shop delivery task tracking fetched successfully", data);
    } catch (error) {
      return next(error);
    }
  },
  async customerOrderDelivery(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await deliveryTaskService.customerOrderDelivery(getParam(req.params.orderId));
      return sendSuccess(res, "Order delivery fetched successfully", data);
    } catch (error) {
      return next(error);
    }
  },
  async customerOrderTracking(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await deliveryTaskService.customerOrderTracking(getParam(req.params.orderId));
      return sendSuccess(res, "Order tracking fetched successfully", data);
    } catch (error) {
      return next(error);
    }
  },
  async createParcel(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await deliveryTaskService.createParcel(req.authUser!.userId, req.body);
      return sendSuccess(res, "Parcel order created successfully", data);
    } catch (error) {
      return next(error);
    }
  },
  async myParcels(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await deliveryTaskRepository.listParcelOrdersByCustomer(req.authUser!.userId);
      return sendSuccess(res, "Parcel orders fetched successfully", data);
    } catch (error) {
      return next(error);
    }
  },
  async parcelDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await deliveryTaskRepository.findParcelById(getParam(req.params.id));
      return sendSuccess(res, "Parcel order fetched successfully", data);
    } catch (error) {
      return next(error);
    }
  }
};
