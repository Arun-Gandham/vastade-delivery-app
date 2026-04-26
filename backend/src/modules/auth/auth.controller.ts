import { NextFunction, Request, Response } from "express";
import { sendSuccess } from "../../core/http/response";
import { authService } from "./auth.service";

export const authController = {
  async registerCustomer(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await authService.registerCustomer(req.body);
      return sendSuccess(res, "Customer registered successfully", data);
    } catch (error) {
      return next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await authService.login({
        ...req.body,
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"]
      });
      return sendSuccess(res, "Login successful", data);
    } catch (error) {
      return next(error);
    }
  },

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await authService.refreshToken(req.body.refreshToken);
      return sendSuccess(res, "Token refreshed", data);
    } catch (error) {
      return next(error);
    }
  },

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      await authService.logout(req.body.refreshToken);
      return sendSuccess(res, "Logged out successfully");
    } catch (error) {
      return next(error);
    }
  },

  async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      await authService.changePassword(
        req.authUser!.userId,
        req.body.oldPassword,
        req.body.newPassword
      );
      return sendSuccess(res, "Password updated successfully");
    } catch (error) {
      return next(error);
    }
  }
};
