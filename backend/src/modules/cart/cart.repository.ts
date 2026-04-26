import { Prisma } from "@prisma/client";
import { prisma } from "../../database/prisma";

const db = (tx?: Prisma.TransactionClient) => tx ?? prisma;

export const cartRepository = {
  findCart: (customerId: string, shopId: string, tx?: Prisma.TransactionClient) =>
    db(tx).cart.findUnique({
      where: { customerId_shopId: { customerId, shopId } },
      include: {
        items: {
          include: { product: true }
        },
        shop: true
      }
    }),
  findCartByItemId: (cartItemId: string, tx?: Prisma.TransactionClient) =>
    db(tx).cartItem.findUnique({
      where: { id: cartItemId },
      include: {
        cart: true,
        product: true
      }
    }),
  upsertCart: (customerId: string, shopId: string, tx?: Prisma.TransactionClient) =>
    db(tx).cart.upsert({
      where: { customerId_shopId: { customerId, shopId } },
      create: { customerId, shopId },
      update: {},
      include: { items: true }
    }),
  upsertItem: (
    cartId: string,
    productId: string,
    quantity: number,
    unitPrice: number,
    tx?: Prisma.TransactionClient
  ) =>
    db(tx).cartItem.upsert({
      where: { cartId_productId: { cartId, productId } },
      create: {
        cartId,
        productId,
        quantity,
        unitPrice,
        totalPrice: quantity * unitPrice
      },
      update: {
        quantity: { increment: quantity },
        totalPrice: {
          increment: quantity * unitPrice
        },
        unitPrice
      }
    }),
  updateItem: (id: string, quantity: number, unitPrice: number, tx?: Prisma.TransactionClient) =>
    db(tx).cartItem.update({
      where: { id },
      data: {
        quantity,
        unitPrice,
        totalPrice: quantity * unitPrice
      }
    }),
  deleteItem: (id: string, tx?: Prisma.TransactionClient) =>
    db(tx).cartItem.delete({ where: { id } }),
  clearCart: (cartId: string, tx?: Prisma.TransactionClient) =>
    db(tx).cartItem.deleteMany({ where: { cartId } })
};
