import { Request, Response } from "express";
import { sendSuccess } from "../../core/http/response";
import { getParam } from "../../core/utils/request";
import { categoryService } from "./category.service";

export const categoryController = {
  async create(req: Request, res: Response) {
    const data = await categoryService.create(req.body);
    return sendSuccess(res, "Category created successfully", data);
  },
  async list(_req: Request, res: Response) {
    const data = await categoryService.list();
    return sendSuccess(res, "Categories fetched successfully", data);
  },
  async update(req: Request, res: Response) {
    const data = await categoryService.update(getParam(req.params.categoryId), req.body);
    return sendSuccess(res, "Category updated successfully", data);
  },
  async remove(req: Request, res: Response) {
    await categoryService.remove(getParam(req.params.categoryId));
    return sendSuccess(res, "Category deleted successfully");
  }
};
