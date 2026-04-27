-- AlterTable
ALTER TABLE `captain` ADD COLUMN `agreementAccepted` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `approvalNotes` VARCHAR(191) NULL,
    ADD COLUMN `availabilityStatus` ENUM('OFFLINE', 'ONLINE', 'BUSY') NOT NULL DEFAULT 'OFFLINE',
    ADD COLUMN `blockedAt` DATETIME(3) NULL,
    ADD COLUMN `blockedReason` VARCHAR(191) NULL,
    ADD COLUMN `city` VARCHAR(150) NULL,
    ADD COLUMN `dateOfBirth` DATETIME(3) NULL,
    ADD COLUMN `emergencyContactName` VARCHAR(150) NULL,
    ADD COLUMN `emergencyContactPhone` VARCHAR(20) NULL,
    ADD COLUMN `fullAddress` VARCHAR(191) NULL,
    ADD COLUMN `idProofNumber` VARCHAR(100) NULL,
    ADD COLUMN `pincode` VARCHAR(10) NULL,
    ADD COLUMN `profilePhoto` VARCHAR(191) NULL,
    ADD COLUMN `rating` DECIMAL(4, 2) NULL,
    ADD COLUMN `registrationStatus` ENUM('SUBMITTED', 'PENDING_VERIFICATION', 'APPROVED', 'REJECTED', 'BLOCKED') NOT NULL DEFAULT 'SUBMITTED',
    ADD COLUMN `rejectionReason` VARCHAR(191) NULL,
    ADD COLUMN `state` VARCHAR(150) NULL,
    ADD COLUMN `termsAccepted` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `totalDeliveries` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `verifiedAt` DATETIME(3) NULL,
    MODIFY `vehicleType` ENUM('BIKE', 'SCOOTER', 'CYCLE', 'CAR', 'AUTO', 'WALKING') NOT NULL;

-- CreateTable
CREATE TABLE `CaptainDocument` (
    `id` VARCHAR(191) NOT NULL,
    `captainId` VARCHAR(191) NOT NULL,
    `documentType` ENUM('PROFILE_PHOTO', 'VEHICLE_RC', 'DRIVING_LICENSE_FRONT', 'DRIVING_LICENSE_BACK', 'ID_PROOF_FRONT', 'ID_PROOF_BACK', 'AGREEMENT', 'OTHER') NOT NULL,
    `documentNumber` VARCHAR(100) NULL,
    `fileKey` VARCHAR(191) NOT NULL,
    `fileUrl` VARCHAR(191) NULL,
    `isVerified` BOOLEAN NOT NULL DEFAULT false,
    `verifiedAt` DATETIME(3) NULL,
    `rejectionReason` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CaptainVehicle` (
    `id` VARCHAR(191) NOT NULL,
    `captainId` VARCHAR(191) NOT NULL,
    `vehicleType` ENUM('BIKE', 'SCOOTER', 'CYCLE', 'CAR', 'AUTO', 'WALKING') NOT NULL,
    `vehicleNumber` VARCHAR(50) NOT NULL,
    `rcDocumentKey` VARCHAR(191) NULL,
    `isPrimary` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CaptainBankDetail` (
    `id` VARCHAR(191) NOT NULL,
    `captainId` VARCHAR(191) NOT NULL,
    `accountHolderName` VARCHAR(150) NOT NULL,
    `accountNumber` VARCHAR(50) NOT NULL,
    `ifscCode` VARCHAR(20) NOT NULL,
    `upiId` VARCHAR(100) NULL,
    `isPrimary` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CaptainVerificationLog` (
    `id` VARCHAR(191) NOT NULL,
    `captainId` VARCHAR(191) NOT NULL,
    `action` ENUM('SUBMITTED', 'PENDING_VERIFICATION', 'APPROVED', 'REJECTED', 'BLOCKED') NOT NULL,
    `remarks` VARCHAR(191) NULL,
    `performedByUserId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DeliveryTask` (
    `id` VARCHAR(191) NOT NULL,
    `taskType` ENUM('GROCERY', 'PARCEL', 'FOOD', 'MEDICINE', 'CUSTOM') NOT NULL,
    `referenceId` VARCHAR(191) NOT NULL,
    `referenceTable` VARCHAR(100) NOT NULL,
    `shopId` VARCHAR(191) NULL,
    `customerId` VARCHAR(191) NULL,
    `captainId` VARCHAR(191) NULL,
    `status` ENUM('CREATED', 'SEARCHING_CAPTAIN', 'OFFERED_TO_CAPTAINS', 'ACCEPTED', 'CAPTAIN_REACHED_PICKUP', 'PICKED_UP', 'CAPTAIN_REACHED_DROP', 'DELIVERED', 'CANCELLED', 'FAILED') NOT NULL DEFAULT 'CREATED',
    `pickupName` VARCHAR(150) NULL,
    `pickupPhone` VARCHAR(20) NULL,
    `pickupAddress` VARCHAR(191) NOT NULL,
    `pickupLatitude` DECIMAL(10, 7) NULL,
    `pickupLongitude` DECIMAL(10, 7) NULL,
    `dropName` VARCHAR(150) NULL,
    `dropPhone` VARCHAR(20) NULL,
    `dropAddress` VARCHAR(191) NOT NULL,
    `dropLatitude` DECIMAL(10, 7) NULL,
    `dropLongitude` DECIMAL(10, 7) NULL,
    `deliveryFee` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `distanceKm` DECIMAL(10, 2) NULL,
    `estimatedPickupAt` DATETIME(3) NULL,
    `estimatedDeliveryAt` DATETIME(3) NULL,
    `assignedAt` DATETIME(3) NULL,
    `pickedUpAt` DATETIME(3) NULL,
    `deliveredAt` DATETIME(3) NULL,
    `cancelledAt` DATETIME(3) NULL,
    `failureReason` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CaptainLocation` (
    `id` VARCHAR(191) NOT NULL,
    `captainId` VARCHAR(191) NOT NULL,
    `latitude` DECIMAL(10, 7) NOT NULL,
    `longitude` DECIMAL(10, 7) NOT NULL,
    `heading` DECIMAL(10, 2) NULL,
    `speed` DECIMAL(10, 2) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CaptainTaskOffer` (
    `id` VARCHAR(191) NOT NULL,
    `deliveryTaskId` VARCHAR(191) NOT NULL,
    `captainId` VARCHAR(191) NOT NULL,
    `status` ENUM('SENT', 'ACCEPTED', 'REJECTED', 'EXPIRED', 'CANCELLED') NOT NULL DEFAULT 'SENT',
    `distanceToPickupKm` DECIMAL(10, 2) NULL,
    `pickupToDropKm` DECIMAL(10, 2) NULL,
    `estimatedEarning` DECIMAL(10, 2) NULL,
    `offeredAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `respondedAt` DATETIME(3) NULL,
    `expiresAt` DATETIME(3) NULL,
    `rejectionReason` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `CaptainTaskOffer_deliveryTaskId_captainId_key`(`deliveryTaskId`, `captainId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CaptainEarning` (
    `id` VARCHAR(191) NOT NULL,
    `captainId` VARCHAR(191) NOT NULL,
    `deliveryTaskId` VARCHAR(191) NOT NULL,
    `amount` DECIMAL(10, 2) NOT NULL,
    `status` VARCHAR(50) NOT NULL,
    `settledAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CaptainNotification` (
    `id` VARCHAR(191) NOT NULL,
    `captainId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(200) NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `payload` JSON NULL,
    `isRead` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ParcelOrder` (
    `id` VARCHAR(191) NOT NULL,
    `customerId` VARCHAR(191) NOT NULL,
    `senderName` VARCHAR(150) NOT NULL,
    `senderPhone` VARCHAR(20) NOT NULL,
    `pickupAddress` VARCHAR(191) NOT NULL,
    `pickupLatitude` DECIMAL(10, 7) NULL,
    `pickupLongitude` DECIMAL(10, 7) NULL,
    `receiverName` VARCHAR(150) NOT NULL,
    `receiverPhone` VARCHAR(20) NOT NULL,
    `dropAddress` VARCHAR(191) NOT NULL,
    `dropLatitude` DECIMAL(10, 7) NULL,
    `dropLongitude` DECIMAL(10, 7) NULL,
    `packageDetails` VARCHAR(191) NULL,
    `status` VARCHAR(50) NOT NULL,
    `deliveryFee` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CaptainDocument` ADD CONSTRAINT `CaptainDocument_captainId_fkey` FOREIGN KEY (`captainId`) REFERENCES `Captain`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CaptainVehicle` ADD CONSTRAINT `CaptainVehicle_captainId_fkey` FOREIGN KEY (`captainId`) REFERENCES `Captain`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CaptainBankDetail` ADD CONSTRAINT `CaptainBankDetail_captainId_fkey` FOREIGN KEY (`captainId`) REFERENCES `Captain`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CaptainVerificationLog` ADD CONSTRAINT `CaptainVerificationLog_captainId_fkey` FOREIGN KEY (`captainId`) REFERENCES `Captain`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DeliveryTask` ADD CONSTRAINT `DeliveryTask_captainId_fkey` FOREIGN KEY (`captainId`) REFERENCES `Captain`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CaptainLocation` ADD CONSTRAINT `CaptainLocation_captainId_fkey` FOREIGN KEY (`captainId`) REFERENCES `Captain`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CaptainTaskOffer` ADD CONSTRAINT `CaptainTaskOffer_deliveryTaskId_fkey` FOREIGN KEY (`deliveryTaskId`) REFERENCES `DeliveryTask`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CaptainTaskOffer` ADD CONSTRAINT `CaptainTaskOffer_captainId_fkey` FOREIGN KEY (`captainId`) REFERENCES `Captain`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CaptainEarning` ADD CONSTRAINT `CaptainEarning_captainId_fkey` FOREIGN KEY (`captainId`) REFERENCES `Captain`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CaptainEarning` ADD CONSTRAINT `CaptainEarning_deliveryTaskId_fkey` FOREIGN KEY (`deliveryTaskId`) REFERENCES `DeliveryTask`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CaptainNotification` ADD CONSTRAINT `CaptainNotification_captainId_fkey` FOREIGN KEY (`captainId`) REFERENCES `Captain`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ParcelOrder` ADD CONSTRAINT `ParcelOrder_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
