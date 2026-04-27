import {
  CaptainAvailabilityStatus,
  CaptainDocumentType,
  CaptainRegistrationStatus,
  Prisma,
  UserRole,
  VehicleType
} from "@prisma/client";
import { prisma } from "../../database/prisma";
import type {
  CaptainDocumentUploadInput,
  CaptainLocationUpdateInput,
  CaptainProfileUpdateInput,
  CaptainRegistrationInput,
  CaptainStatusUpdateInput
} from "./captain.types";

const db = (tx?: Prisma.TransactionClient) => tx ?? prisma;

export const captainRepository = {
  findUserByMobile: (mobile: string) =>
    prisma.user.findUnique({
      where: { mobile }
    }),

  createCaptainApplication: async (input: CaptainRegistrationInput & { passwordHash: string }) =>
    prisma.user.create({
      data: {
        name: input.name,
        mobile: input.mobile,
        email: input.email,
        passwordHash: input.passwordHash,
        role: UserRole.CAPTAIN,
        profileImage: input.profilePhoto,
        captainProfile: {
          create: {
            profilePhoto: input.profilePhoto,
            dateOfBirth: new Date(input.dateOfBirth),
            fullAddress: input.fullAddress,
            city: input.city,
            state: input.state,
            pincode: input.pincode,
            emergencyContactName: input.emergencyContactName,
            emergencyContactPhone: input.emergencyContactPhone,
            vehicleType: input.vehicleType as VehicleType,
            vehicleNumber: input.vehicleNumber,
            licenseNumber: input.drivingLicenseNumber,
            idProofNumber: input.idProofNumber,
            agreementAccepted: input.agreementAccepted,
            termsAccepted: input.termsAccepted,
            registrationStatus: CaptainRegistrationStatus.SUBMITTED,
            availabilityStatus: CaptainAvailabilityStatus.OFFLINE,
            vehicles: {
              create: {
                vehicleType: input.vehicleType as VehicleType,
                vehicleNumber: input.vehicleNumber,
                rcDocumentKey: input.vehicleRcDocument,
                isPrimary: true
              }
            },
            bankDetails: {
              create: {
                accountHolderName: input.bankAccountHolderName,
                accountNumber: input.bankAccountNumber,
                ifscCode: input.ifscCode,
                upiId: input.upiId,
                isPrimary: true
              }
            },
            documents: {
              create: [
                {
                  documentType: CaptainDocumentType.PROFILE_PHOTO,
                  fileKey: input.profilePhoto
                },
                {
                  documentType: CaptainDocumentType.VEHICLE_RC,
                  fileKey: input.vehicleRcDocument
                },
                {
                  documentType: CaptainDocumentType.DRIVING_LICENSE_FRONT,
                  documentNumber: input.drivingLicenseNumber,
                  fileKey: input.drivingLicenseFrontImage
                },
                {
                  documentType: CaptainDocumentType.DRIVING_LICENSE_BACK,
                  documentNumber: input.drivingLicenseNumber,
                  fileKey: input.drivingLicenseBackImage
                },
                {
                  documentType: CaptainDocumentType.ID_PROOF_FRONT,
                  documentNumber: input.idProofNumber,
                  fileKey: input.idProofFrontImage
                },
                {
                  documentType: CaptainDocumentType.ID_PROOF_BACK,
                  documentNumber: input.idProofNumber,
                  fileKey: input.idProofBackImage
                }
              ]
            },
            verificationLogs: {
              create: {
                action: CaptainRegistrationStatus.SUBMITTED,
                remarks: "Captain self-registration submitted"
              }
            }
          }
        }
      },
      include: {
        captainProfile: {
          include: {
            documents: true,
            vehicles: true,
            bankDetails: true
          }
        }
      }
    }),

  findProfileByUserId: (userId: string) =>
    prisma.captain.findUnique({
      where: { userId },
      include: {
        user: true,
        documents: true,
        vehicles: true,
        bankDetails: true,
        verificationLogs: { orderBy: { createdAt: "desc" } }
      }
    }),

  updateProfile: (userId: string, input: CaptainProfileUpdateInput) =>
    prisma.captain.update({
      where: { userId },
      data: {
        profilePhoto: input.profilePhoto,
        dateOfBirth: input.dateOfBirth ? new Date(input.dateOfBirth) : undefined,
        fullAddress: input.fullAddress,
        city: input.city,
        state: input.state,
        pincode: input.pincode,
        emergencyContactName: input.emergencyContactName,
        emergencyContactPhone: input.emergencyContactPhone,
        vehicleNumber: input.vehicleNumber,
        licenseNumber: input.drivingLicenseNumber,
        idProofNumber: input.idProofNumber
      },
      include: { user: true, documents: true, vehicles: true, bankDetails: true }
    }),

  uploadDocument: (captainId: string, input: CaptainDocumentUploadInput) =>
    prisma.captainDocument.create({
      data: {
        captainId,
        documentType: input.documentType,
        documentNumber: input.documentNumber,
        fileKey: input.fileKey,
        fileUrl: input.fileUrl
      }
    }),

  listDocuments: (captainId: string) =>
    prisma.captainDocument.findMany({
      where: { captainId },
      orderBy: { createdAt: "desc" }
    }),

  deleteDocument: (captainId: string, documentId: string) =>
    prisma.captainDocument.deleteMany({
      where: { id: documentId, captainId }
    }),

  updateStatusByUserId: (userId: string, input: CaptainStatusUpdateInput) =>
    prisma.captain.update({
      where: { userId },
      data: {
        availabilityStatus: input.availabilityStatus,
        isOnline: input.availabilityStatus === CaptainAvailabilityStatus.ONLINE,
        isAvailable: input.availabilityStatus !== CaptainAvailabilityStatus.BUSY,
        currentLatitude: input.latitude,
        currentLongitude: input.longitude
      },
      include: { user: true }
    }),

  updateLocationByUserId: async (userId: string, input: CaptainLocationUpdateInput) => {
    const captain = await prisma.captain.update({
      where: { userId },
      data: {
        currentLatitude: input.latitude,
        currentLongitude: input.longitude
      }
    });

    await prisma.captainLocation.create({
      data: {
        captainId: captain.id,
        latitude: input.latitude,
        longitude: input.longitude,
        heading: input.heading,
        speed: input.speed
      }
    });

    return prisma.captain.findUnique({
      where: { userId },
      include: { user: true }
    });
  },

  listApplications: () =>
    prisma.captain.findMany({
      include: { user: true, documents: true, vehicles: true, bankDetails: true },
      orderBy: { createdAt: "desc" }
    }),

  findById: (captainId: string) =>
    prisma.captain.findUnique({
      where: { id: captainId },
      include: {
        user: true,
        documents: true,
        vehicles: true,
        bankDetails: true,
        verificationLogs: { orderBy: { createdAt: "desc" } }
      }
    }),

  createVerificationLog: (
    captainId: string,
    action: CaptainRegistrationStatus,
    remarks?: string,
    performedByUserId?: string,
    tx?: Prisma.TransactionClient
  ) =>
    db(tx).captainVerificationLog.create({
      data: {
        captainId,
        action,
        remarks,
        performedByUserId
      }
    }),

  approve: (captainId: string, adminId: string, remarks?: string, tx?: Prisma.TransactionClient) =>
    db(tx).captain.update({
      where: { id: captainId },
      data: {
        registrationStatus: CaptainRegistrationStatus.APPROVED,
        verifiedAt: new Date(),
        approvalNotes: remarks,
        blockedAt: null,
        blockedReason: null
      }
    }),

  reject: (captainId: string, reason?: string, tx?: Prisma.TransactionClient) =>
    db(tx).captain.update({
      where: { id: captainId },
      data: {
        registrationStatus: CaptainRegistrationStatus.REJECTED,
        rejectionReason: reason,
        availabilityStatus: CaptainAvailabilityStatus.OFFLINE,
        isOnline: false,
        isAvailable: false
      }
    }),

  block: (captainId: string, reason?: string, tx?: Prisma.TransactionClient) =>
    db(tx).captain.update({
      where: { id: captainId },
      data: {
        registrationStatus: CaptainRegistrationStatus.BLOCKED,
        blockedAt: new Date(),
        blockedReason: reason,
        availabilityStatus: CaptainAvailabilityStatus.OFFLINE,
        isOnline: false,
        isAvailable: false
      }
    }),

  unblock: (captainId: string, remarks?: string, tx?: Prisma.TransactionClient) =>
    db(tx).captain.update({
      where: { id: captainId },
      data: {
        registrationStatus: CaptainRegistrationStatus.APPROVED,
        blockedAt: null,
        blockedReason: null,
        approvalNotes: remarks,
        isAvailable: true
      }
    }),

  listDeliveries: (captainId: string) =>
    prisma.deliveryTask.findMany({
      where: { captainId },
      orderBy: { createdAt: "desc" }
    }),

  listEarnings: (captainId: string) =>
    prisma.captainEarning.findMany({
      where: { captainId },
      orderBy: { createdAt: "desc" }
    })
};
