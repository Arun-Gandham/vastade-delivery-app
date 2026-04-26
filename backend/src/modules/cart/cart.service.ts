import { StatusCodes } from "http-status-codes";
import { ERROR_CODES } from "../../constants/error-codes";
import { AppError } from "../../core/errors/app-error";
import { prisma } from "../../database/prisma";
import { inventoryRepository } from "../inventory/inventory.repository";
import { productService } from "../products/product.service";
import { shopService } from "../shops/shop.service";
import { cartRepository } from "./cart.repository";

const validateStock = async (shopId: string, productId: string, quantity: number) => {
  const inventory = await inventoryRepository.findByShopProduct(shopId, productId);
  if (!inventory || !inventory.isAvailable || inventory.availableStock < quantity) {
    throw new AppError("Insufficient stock", StatusCodes.BAD_REQUEST, ERROR_CODES.INSUFFICIENT_STOCK);
  }
  return inventory;
};

export const cartService = {
  async get(customerId: string, shopId: string) {
    const cart = await cartRepository.findCart(customerId, shopId);
    return cart ?? { items: [] };
  },

  async addItem(customerId: string, input: { shopId: string; productId: string; quantity: number }) {
    await shopService.details(input.shopId);
    const product = await productService.details(input.productId);
    if (!product.isActive) {
      throw new AppError("Product inactive", StatusCodes.BAD_REQUEST, ERROR_CODES.PRODUCT_NOT_FOUND);
    }
    await validateStock(input.shopId, input.productId, input.quantity);

    return prisma.$transaction(async (tx) => {
      const activeOtherShopCart = await prisma.cart.findFirst({
        where: {
          customerId,
          shopId: { not: input.shopId },
          items: { some: {} }
        }
      });
      if (activeOtherShopCart) {
        throw new AppError("Cart belongs to another shop", StatusCodes.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR);
      }
      const cart = await cartRepository.upsertCart(customerId, input.shopId, tx);
      await cartRepository.upsertItem(
        cart.id,
        input.productId,
        input.quantity,
        Number(product.sellingPrice),
        tx
      );
      return cartRepository.findCart(customerId, input.shopId, tx);
    });
  },

  async updateItem(customerId: string, cartItemId: string, quantity: number) {
    const cartItem = await cartRepository.findCartByItemId(cartItemId);
    if (!cartItem || cartItem.cart.customerId !== customerId) {
      throw new AppError("Cart item not found", StatusCodes.NOT_FOUND, ERROR_CODES.CART_ITEM_NOT_FOUND);
    }

    await validateStock(cartItem.cart.shopId, cartItem.productId, quantity);
    return cartRepository.updateItem(cartItem.id, quantity, Number(cartItem.product.sellingPrice));
  },

  async deleteItem(customerId: string, cartItemId: string) {
    const cartItem = await cartRepository.findCartByItemId(cartItemId);
    if (!cartItem || cartItem.cart.customerId !== customerId) {
      throw new AppError("Cart item not found", StatusCodes.NOT_FOUND, ERROR_CODES.CART_ITEM_NOT_FOUND);
    }
    await cartRepository.deleteItem(cartItemId);
  },

  async clear(customerId: string, shopId: string) {
    const cart = await cartRepository.findCart(customerId, shopId);
    if (cart) {
      await cartRepository.clearCart(cart.id);
    }
  }
};
