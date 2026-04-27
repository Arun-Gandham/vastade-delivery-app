const {
  CaptainAvailabilityStatus,
  CaptainRegistrationStatus,
  CaptainDocumentType,
  AddressType,
  NotificationChannel,
  PaymentMode,
  PaymentStatus,
  PrismaClient,
  UserRole,
  VehicleType
} = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function hashPassword(password) {
  return bcrypt.hash(password, 12);
}

async function main() {
  const superAdminPassword = await hashPassword("SuperAdmin@123");
  const adminPassword = await hashPassword("Admin@123");
  const customerPassword = await hashPassword("Customer@123");
  const captainPassword = await hashPassword("Captain@123");

  const superAdmin = await prisma.user.upsert({
    where: { mobile: "9999999998" },
    update: {
      name: "Platform Super Admin",
      email: "superadmin@example.com",
      passwordHash: superAdminPassword,
      role: UserRole.SUPER_ADMIN,
      isMobileVerified: true,
      isEmailVerified: true,
      isActive: true
    },
    create: {
      name: "Platform Super Admin",
      mobile: "9999999998",
      email: "superadmin@example.com",
      passwordHash: superAdminPassword,
      role: UserRole.SUPER_ADMIN,
      isMobileVerified: true,
      isEmailVerified: true
    }
  });

  const admin = await prisma.user.upsert({
    where: { mobile: "9999999999" },
    update: {
      isActive: true
    },
    create: {
      name: "Platform Admin",
      mobile: "9999999999",
      email: "admin@example.com",
      passwordHash: adminPassword,
      role: UserRole.ADMIN
    }
  });

  const owner = await prisma.user.upsert({
    where: { mobile: "8888888888" },
    update: {
      isActive: true
    },
    create: {
      name: "Shop Owner",
      mobile: "8888888888",
      email: "owner@example.com",
      passwordHash: adminPassword,
      role: UserRole.SHOP_OWNER
    }
  });

  const customer = await prisma.user.upsert({
    where: { mobile: "7777777777" },
    update: {
      isActive: true
    },
    create: {
      name: "Pilot Customer",
      mobile: "7777777777",
      email: "customer@example.com",
      passwordHash: customerPassword,
      role: UserRole.CUSTOMER
    }
  });

  const captainUser = await prisma.user.upsert({
    where: { mobile: "6666666666" },
    update: {
      isActive: true
    },
    create: {
      name: "Pilot Captain",
      mobile: "6666666666",
      email: "captain@example.com",
      passwordHash: captainPassword,
      role: UserRole.CAPTAIN
    }
  });

  const captainProfile = await prisma.captain.upsert({
    where: { userId: captainUser.id },
    update: {
      profilePhoto: "qa/captains/profile-photo.jpg",
      dateOfBirth: new Date("1996-05-15T00:00:00.000Z"),
      fullAddress: "2-45, Captain Street, Pilot Village",
      city: "Pilot City",
      state: "Andhra Pradesh",
      pincode: "533001",
      emergencyContactName: "Captain Emergency",
      emergencyContactPhone: "6666666667",
      vehicleType: VehicleType.BIKE,
      vehicleNumber: "AP09AB1234",
      licenseNumber: "DL-TEST-12345",
      idProofNumber: "ABCDE1234F",
      agreementAccepted: true,
      termsAccepted: true,
      registrationStatus: CaptainRegistrationStatus.APPROVED,
      availabilityStatus: CaptainAvailabilityStatus.ONLINE,
      isOnline: true,
      isAvailable: true,
      currentLatitude: 17.385,
      currentLongitude: 78.4867
    },
    create: {
      userId: captainUser.id,
      profilePhoto: "qa/captains/profile-photo.jpg",
      dateOfBirth: new Date("1996-05-15T00:00:00.000Z"),
      fullAddress: "2-45, Captain Street, Pilot Village",
      city: "Pilot City",
      state: "Andhra Pradesh",
      pincode: "533001",
      emergencyContactName: "Captain Emergency",
      emergencyContactPhone: "6666666667",
      vehicleType: VehicleType.BIKE,
      vehicleNumber: "AP09AB1234",
      licenseNumber: "DL-TEST-12345",
      idProofNumber: "ABCDE1234F",
      agreementAccepted: true,
      termsAccepted: true,
      registrationStatus: CaptainRegistrationStatus.APPROVED,
      availabilityStatus: CaptainAvailabilityStatus.ONLINE,
      isOnline: true,
      isAvailable: true,
      currentLatitude: 17.385,
      currentLongitude: 78.4867
    }
  });

  await prisma.captainVehicle.upsert({
    where: { id: "33333333-3333-3333-3333-333333333333" },
    update: {},
    create: {
      id: "33333333-3333-3333-3333-333333333333",
      captainId: captainProfile.id,
      vehicleType: VehicleType.BIKE,
      vehicleNumber: "AP09AB1234",
      rcDocumentKey: "qa/captains/vehicle-rc.jpg",
      isPrimary: true
    }
  });

  await prisma.captainBankDetail.upsert({
    where: { id: "44444444-4444-4444-4444-444444444444" },
    update: {},
    create: {
      id: "44444444-4444-4444-4444-444444444444",
      captainId: captainProfile.id,
      accountHolderName: "Pilot Captain",
      accountNumber: "123456789012",
      ifscCode: "HDFC0001234",
      upiId: "captain@upi",
      isPrimary: true
    }
  });

  for (const document of [
    ["55555555-5555-5555-5555-555555555551", CaptainDocumentType.PROFILE_PHOTO, "qa/captains/profile-photo.jpg"],
    ["55555555-5555-5555-5555-555555555552", CaptainDocumentType.VEHICLE_RC, "qa/captains/vehicle-rc.jpg"],
    ["55555555-5555-5555-5555-555555555553", CaptainDocumentType.DRIVING_LICENSE_FRONT, "qa/captains/license-front.jpg"],
    ["55555555-5555-5555-5555-555555555554", CaptainDocumentType.DRIVING_LICENSE_BACK, "qa/captains/license-back.jpg"],
    ["55555555-5555-5555-5555-555555555555", CaptainDocumentType.ID_PROOF_FRONT, "qa/captains/id-front.jpg"],
    ["55555555-5555-5555-5555-555555555556", CaptainDocumentType.ID_PROOF_BACK, "qa/captains/id-back.jpg"]
  ]) {
    await prisma.captainDocument.upsert({
      where: { id: document[0] },
      update: {},
      create: {
        id: document[0],
        captainId: captainProfile.id,
        documentType: document[1],
        fileKey: document[2],
        isVerified: true,
        verifiedAt: new Date()
      }
    });
  }

  const category = await prisma.category.upsert({
    where: { slug: "vegetables" },
    update: {},
    create: {
      name: "Vegetables",
      slug: "vegetables",
      sortOrder: 1
    }
  });

  const shop = await prisma.shop.upsert({
    where: { id: "11111111-1111-1111-1111-111111111111" },
    update: {},
    create: {
      id: "11111111-1111-1111-1111-111111111111",
      ownerId: owner.id,
      name: "Village Fresh Mart",
      mobile: "8888888888",
      address: "Main Road",
      village: "Pilot Village",
      pincode: "533001",
      openingTime: "07:00",
      closingTime: "22:00"
    }
  });

  const product = await prisma.product.upsert({
    where: { slug: "tomato" },
    update: {},
    create: {
      categoryId: category.id,
      name: "Tomato",
      slug: "tomato",
      unit: "kg",
      mrp: 40,
      sellingPrice: 32
    }
  });

  await prisma.shopInventory.upsert({
    where: { shopId_productId: { shopId: shop.id, productId: product.id } },
    update: {},
    create: {
      shopId: shop.id,
      productId: product.id,
      availableStock: 100,
      lowStockAlert: 10
    }
  });

  await prisma.customerAddress.upsert({
    where: { id: "22222222-2222-2222-2222-222222222222" },
    update: {},
    create: {
      id: "22222222-2222-2222-2222-222222222222",
      customerId: customer.id,
      fullName: "Pilot Customer",
      mobile: customer.mobile,
      houseNo: "1-10",
      street: "Main Street",
      village: "Pilot Village",
      pincode: "533001",
      addressType: AddressType.HOME,
      isDefault: true
    }
  });

  await prisma.notification.create({
    data: {
      userId: admin.id,
      channel: NotificationChannel.IN_APP,
      title: "Seed complete",
      message: "Sample data has been created successfully."
    }
  });

  console.log(
    JSON.stringify({
      superAdminId: superAdmin.id,
      adminId: admin.id,
      customerId: customer.id,
      captainId: captainUser.id,
      shopId: shop.id,
      productId: product.id,
      defaults: {
        paymentMode: PaymentMode.COD,
        paymentStatus: PaymentStatus.COD_PENDING
      }
    })
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
