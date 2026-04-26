import dayjs from "dayjs";
import { Prisma } from "@prisma/client";

export const generateOrderNumber = async (tx: Prisma.TransactionClient) => {
  const prefix = `QC-${dayjs().format("YYYYMMDD")}`;
  const count = await tx.order.count({
    where: {
      orderNumber: {
        startsWith: prefix
      }
    }
  });

  return `${prefix}-${String(count + 1).padStart(6, "0")}`;
};
