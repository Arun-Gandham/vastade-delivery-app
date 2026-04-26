import { StatusCodes } from "http-status-codes";
import { ERROR_CODES } from "../../constants/error-codes";
import { AppError } from "../../core/errors/app-error";
import { addressRepository } from "./address.repository";
import { AddressCreateInput, AddressUpdateInput } from "./address.types";

const assertOwnership = async (addressId: string, customerId: string) => {
  const address = await addressRepository.findById(addressId);
  if (!address || address.customerId !== customerId) {
    throw new AppError("Address not found", StatusCodes.NOT_FOUND, ERROR_CODES.USER_NOT_FOUND);
  }
  return address;
};

export const addressService = {
  async create(customerId: string, input: AddressCreateInput) {
    if (input.isDefault) {
      await addressRepository.unsetDefault(customerId);
    }

    return addressRepository.create({
      data: { ...input, customerId }
    });
  },

  async list(customerId: string) {
    return addressRepository.listByCustomer(customerId);
  },

  async update(customerId: string, addressId: string, input: AddressUpdateInput) {
    await assertOwnership(addressId, customerId);
    if (input.isDefault) {
      await addressRepository.unsetDefault(customerId);
    }
    return addressRepository.update(addressId, input);
  },

  async remove(customerId: string, addressId: string) {
    await assertOwnership(addressId, customerId);
    await addressRepository.delete(addressId);
  },

  async setDefault(customerId: string, addressId: string) {
    await assertOwnership(addressId, customerId);
    await addressRepository.unsetDefault(customerId);
    return addressRepository.update(addressId, { isDefault: true });
  }
};
