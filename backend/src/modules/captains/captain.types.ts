import type {
  CaptainAvailabilityStatus,
  CaptainDocumentType,
  CaptainRegistrationStatus,
  VehicleType
} from "@prisma/client";

export type CaptainRegistrationInput = {
  name: string;
  mobile: string;
  email?: string;
  password: string;
  profilePhoto: string;
  dateOfBirth: string;
  fullAddress: string;
  city: string;
  state: string;
  pincode: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  vehicleType: VehicleType;
  vehicleNumber: string;
  vehicleRcDocument: string;
  drivingLicenseNumber: string;
  drivingLicenseFrontImage: string;
  drivingLicenseBackImage: string;
  idProofNumber: string;
  idProofFrontImage: string;
  idProofBackImage: string;
  bankAccountHolderName: string;
  bankAccountNumber: string;
  ifscCode: string;
  upiId?: string;
  agreementAccepted: boolean;
  termsAccepted: boolean;
};

export type CaptainProfileUpdateInput = Partial<
  Omit<
    CaptainRegistrationInput,
    "mobile" | "password" | "agreementAccepted" | "termsAccepted"
  >
>;

export type CaptainDocumentUploadInput = {
  documentType: CaptainDocumentType;
  documentNumber?: string;
  fileKey: string;
  fileUrl?: string;
};

export type CaptainAdminDecisionInput = {
  remarks?: string;
  reason?: string;
};

export type CaptainStatusUpdateInput = {
  availabilityStatus: CaptainAvailabilityStatus;
  latitude?: number;
  longitude?: number;
};

export type CaptainLocationUpdateInput = {
  latitude: number;
  longitude: number;
  heading?: number;
  speed?: number;
};
