import { toNumber } from "@/lib/utils/format";
import type { Cart } from "@/types/domain";

export const getCartSummary = (cart?: Cart | null) => {
  const items = cart?.items ?? [];
  const subtotal = items.reduce((sum, item) => sum + toNumber(item.totalPrice), 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    itemCount,
    subtotal,
  };
};
