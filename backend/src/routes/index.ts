import { Router } from "express";
import { addressRouter } from "../modules/addresses/address.routes";
import { authRouter } from "../modules/auth/auth.routes";
import { captainAdminRouter, captainRouter } from "../modules/captains/captain.routes";
import { cartRouter } from "../modules/cart/cart.routes";
import { adminCategoryRouter, categoryRouter } from "../modules/categories/category.routes";
import { adminCouponRouter, couponRouter } from "../modules/coupons/coupon.routes";
import { adminDashboardRouter, shopDashboardRouter } from "../modules/dashboard/dashboard.routes";
import {
  adminDeliveryTaskRouter,
  captainTaskRouter,
  customerDeliveryTaskRouter,
  parcelRouter,
  shopDeliveryTaskRouter
} from "../modules/delivery-tasks/delivery-task.routes";
import { inventoryRouter } from "../modules/inventory/inventory.routes";
import { notificationRouter } from "../modules/notifications/notification.routes";
import {
  adminOrderRouter,
  captainOrderRouter,
  orderRouter,
  shopOrderRouter
} from "../modules/orders/order.routes";
import { paymentRouter } from "../modules/payments/payment.routes";
import { adminProductRouter, productRouter } from "../modules/products/product.routes";
import { adminShopRouter, shopOwnerShopRouter, shopRouter } from "../modules/shops/shop.routes";
import { uploadRouter } from "../modules/uploads/upload.routes";
import { userRouter } from "../modules/users/user.routes";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/customer/addresses", addressRouter);
apiRouter.use("/shops", shopRouter);
apiRouter.use("/categories", categoryRouter);
apiRouter.use("/products", productRouter);
apiRouter.use("/cart", cartRouter);
apiRouter.use("/orders", orderRouter);
apiRouter.use("/", customerDeliveryTaskRouter);
apiRouter.use("/captains", captainRouter);
apiRouter.use("/captain", captainRouter);
apiRouter.use("/notifications", notificationRouter);
apiRouter.use("/uploads", uploadRouter);
apiRouter.use("/payments", paymentRouter);
apiRouter.use("/coupons", couponRouter);
apiRouter.use("/parcels", parcelRouter);

apiRouter.use("/admin/shops", adminShopRouter);
apiRouter.use("/admin/categories", adminCategoryRouter);
apiRouter.use("/admin/products", adminProductRouter);
apiRouter.use("/admin/coupons", adminCouponRouter);
apiRouter.use("/admin", adminOrderRouter);
apiRouter.use("/admin", adminDashboardRouter);
apiRouter.use("/admin", captainAdminRouter);
apiRouter.use("/admin", adminDeliveryTaskRouter);

apiRouter.use("/shop-owner/shops", inventoryRouter);
apiRouter.use("/shop-owner/shops", shopOwnerShopRouter);
apiRouter.use("/shop-owner", shopOrderRouter);
apiRouter.use("/shop-owner", shopDashboardRouter);
apiRouter.use("/shop", shopDeliveryTaskRouter);

apiRouter.use("/captains", captainOrderRouter);
apiRouter.use("/captains", captainTaskRouter);
apiRouter.use("/captain", captainTaskRouter);
