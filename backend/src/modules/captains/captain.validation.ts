import { z } from "zod";

const mobileSchema = z.string().regex(/^\d{10,15}$/, "Enter a valid mobile number");

export const registerCaptainSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(150),
    mobile: mobileSchema,
    email: z.string().email().optional(),
    password: z.string().min(8),
    profilePhoto: z.string().min(1),
    dateOfBirth: z.string().datetime(),
    fullAddress: z.string().min(5),
    city: z.string().min(2).max(150),
    state: z.string().min(2).max(150),
    pincode: z.string().min(4).max(10),
    emergencyContactName: z.string().min(2).max(150),
    emergencyContactPhone: mobileSchema,
    vehicleType: z.enum(["BIKE", "SCOOTER", "CYCLE", "CAR"]),
    vehicleNumber: z.string().min(3).max(50),
    vehicleRcDocument: z.string().min(1),
    drivingLicenseNumber: z.string().min(3).max(100),
    drivingLicenseFrontImage: z.string().min(1),
    drivingLicenseBackImage: z.string().min(1),
    idProofNumber: z.string().min(3).max(100),
    idProofFrontImage: z.string().min(1),
    idProofBackImage: z.string().min(1),
    bankAccountHolderName: z.string().min(2).max(150),
    bankAccountNumber: z.string().min(6).max(50),
    ifscCode: z.string().min(4).max(20),
    upiId: z.string().optional(),
    agreementAccepted: z.literal(true),
    termsAccepted: z.literal(true)
  })
});

export const captainProfileUpdateSchema = z.object({
  body: registerCaptainSchema.shape.body.partial().omit({
    mobile: true,
    password: true,
    agreementAccepted: true,
    termsAccepted: true
  })
});

export const captainDocumentUploadSchema = z.object({
  body: z.object({
    documentType: z.enum([
      "PROFILE_PHOTO",
      "VEHICLE_RC",
      "DRIVING_LICENSE_FRONT",
      "DRIVING_LICENSE_BACK",
      "ID_PROOF_FRONT",
      "ID_PROOF_BACK",
      "AGREEMENT",
      "OTHER"
    ]),
    documentNumber: z.string().optional(),
    fileKey: z.string().min(1),
    fileUrl: z.string().url().optional()
  })
});

export const captainStatusSchema = z.object({
  body: z.object({
    availabilityStatus: z.enum(["OFFLINE", "ONLINE", "BUSY"]),
    latitude: z.number().optional(),
    longitude: z.number().optional()
  })
});

export const captainGoOnlineSchema = z.object({
  body: z.object({
    latitude: z.number().optional(),
    longitude: z.number().optional()
  })
});

export const captainGoOfflineSchema = z.object({
  body: z.object({})
});

export const captainLocationSchema = z.object({
  body: z.object({
    latitude: z.number(),
    longitude: z.number(),
    heading: z.number().optional(),
    speed: z.number().optional()
  })
});

export const captainDecisionSchema = z.object({
  body: z.object({
    remarks: z.string().optional(),
    reason: z.string().optional()
  })
});
