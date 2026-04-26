"use client";

import type { AddressInput } from "@/features/addresses/address.validation";
import type { Address, User } from "@/types/domain";

type ReverseGeocodeResponse = {
  display_name?: string;
  address?: {
    house_number?: string;
    building?: string;
    road?: string;
    pedestrian?: string;
    neighbourhood?: string;
    suburb?: string;
    village?: string;
    town?: string;
    city?: string;
    city_district?: string;
    county?: string;
    state_district?: string;
    state?: string;
    postcode?: string;
    amenity?: string;
    shop?: string;
    tourism?: string;
    hamlet?: string;
  };
};

const pickFirst = (...values: Array<string | null | undefined>) =>
  values.find((value) => typeof value === "string" && value.trim().length > 0)?.trim();

const normalizePincode = (value?: string | null) => {
  const digits = value?.replace(/\D/g, "") ?? "";
  return digits.length >= 6 ? digits.slice(0, 6) : undefined;
};

export const reverseGeocodeCoordinates = async (latitude: number, longitude: number) => {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&addressdetails=1`,
    {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Unable to resolve your current address from location.");
  }

  return (await response.json()) as ReverseGeocodeResponse;
};

export const buildAddressPayloadFromLocation = ({
  user,
  latitude,
  longitude,
  geocode,
  existingAddress,
}: {
  user: User;
  latitude: number;
  longitude: number;
  geocode: ReverseGeocodeResponse;
  existingAddress?: Address;
}): { label: string; payload: AddressInput } => {
  const address = geocode.address;
  const pincode = normalizePincode(address?.postcode) || existingAddress?.pincode;
  const village =
    pickFirst(
      address?.village,
      address?.town,
      address?.city,
      address?.suburb,
      address?.hamlet,
      address?.county
    ) || existingAddress?.village;
  const street =
    pickFirst(
      address?.road,
      address?.pedestrian,
      address?.neighbourhood,
      address?.suburb,
      address?.village,
      address?.town,
      address?.city
    ) || existingAddress?.street;

  if (!pincode || !village || !street) {
    throw new Error("We couldn't map your location to a complete delivery address. Please add the address manually.");
  }

  const label = geocode.display_name || `${village}, ${pincode}`;

  return {
    label,
    payload: {
      fullName: existingAddress?.fullName || user.name,
      mobile: existingAddress?.mobile || user.mobile,
      houseNo:
        pickFirst(address?.house_number, address?.building, existingAddress?.houseNo) || "Current location",
      street,
      landmark:
        pickFirst(address?.amenity, address?.shop, address?.tourism, existingAddress?.landmark) || undefined,
      village,
      mandal: pickFirst(address?.suburb, address?.hamlet, existingAddress?.mandal) || undefined,
      district:
        pickFirst(address?.city_district, address?.state_district, address?.county, existingAddress?.district) ||
        undefined,
      state: pickFirst(address?.state, existingAddress?.state) || undefined,
      pincode,
      latitude,
      longitude,
      addressType: existingAddress?.addressType || "HOME",
      isDefault: existingAddress?.isDefault ?? true,
    },
  };
};
