import { NextFunction, Request, Response } from "express";
import { sendSuccess } from "../../core/http/response";
import { getParam } from "../../core/utils/request";
import { captainService } from "./captain.service";

export const captainController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await captainService.register(req.body);
      return sendSuccess(res, "Captain application submitted successfully", data);
    } catch (error) {
      return next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await captainService.login({
        ...req.body,
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"]
      });
      return sendSuccess(res, "Captain login successful", data);
    } catch (error) {
      return next(error);
    }
  },

  async me(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await captainService.me(req.authUser!.userId);
      return sendSuccess(res, "Captain profile fetched successfully", data);
    } catch (error) {
      return next(error);
    }
  },

  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await captainService.updateProfile(req.authUser!.userId, req.body);
      return sendSuccess(res, "Captain profile updated successfully", data);
    } catch (error) {
      return next(error);
    }
  },

  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await captainService.updateStatus(req.authUser!.userId, req.body);
      return sendSuccess(res, "Captain availability updated successfully", data);
    } catch (error) {
      return next(error);
    }
  },

  async updateLocation(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await captainService.updateLocation(req.authUser!.userId, req.body);
      return sendSuccess(res, "Captain location updated successfully", data);
    } catch (error) {
      return next(error);
    }
  },

  async uploadDocument(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await captainService.uploadDocument(req.authUser!.userId, req.body);
      return sendSuccess(res, "Captain document uploaded successfully", data);
    } catch (error) {
      return next(error);
    }
  },

  async listDocuments(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await captainService.listDocuments(req.authUser!.userId);
      return sendSuccess(res, "Captain documents fetched successfully", data);
    } catch (error) {
      return next(error);
    }
  },

  async deleteDocument(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await captainService.deleteDocument(req.authUser!.userId, getParam(req.params.id));
      return sendSuccess(res, "Captain document deleted successfully", data);
    } catch (error) {
      return next(error);
    }
  },

  async adminList(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await captainService.adminList();
      return sendSuccess(res, "Captain applications fetched successfully", data);
    } catch (error) {
      return next(error);
    }
  },

  async adminDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await captainService.adminDetails(getParam(req.params.id));
      return sendSuccess(res, "Captain application fetched successfully", data);
    } catch (error) {
      return next(error);
    }
  },

  async approve(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await captainService.approve(getParam(req.params.id), req.authUser!.userId, req.body);
      return sendSuccess(res, "Captain approved successfully", data);
    } catch (error) {
      return next(error);
    }
  },

  async reject(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await captainService.reject(getParam(req.params.id), req.authUser!.userId, req.body);
      return sendSuccess(res, "Captain rejected successfully", data);
    } catch (error) {
      return next(error);
    }
  },

  async block(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await captainService.block(getParam(req.params.id), req.authUser!.userId, req.body);
      return sendSuccess(res, "Captain blocked successfully", data);
    } catch (error) {
      return next(error);
    }
  },

  async unblock(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await captainService.unblock(getParam(req.params.id), req.authUser!.userId, req.body);
      return sendSuccess(res, "Captain unblocked successfully", data);
    } catch (error) {
      return next(error);
    }
  },

  async adminDocuments(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await captainService.adminDocuments(getParam(req.params.id));
      return sendSuccess(res, "Captain documents fetched successfully", data);
    } catch (error) {
      return next(error);
    }
  },

  async adminDeliveries(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await captainService.adminDeliveries(getParam(req.params.id));
      return sendSuccess(res, "Captain deliveries fetched successfully", data);
    } catch (error) {
      return next(error);
    }
  },

  async adminEarnings(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await captainService.adminEarnings(getParam(req.params.id));
      return sendSuccess(res, "Captain earnings fetched successfully", data);
    } catch (error) {
      return next(error);
    }
  }
};
