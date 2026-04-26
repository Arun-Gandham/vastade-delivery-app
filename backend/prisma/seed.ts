import {
  AddressType,
  NotificationChannel,
  PaymentMode,
  PaymentStatus,
  UserRole,
  VehicleType
} from "@prisma/client";
import { prisma } from "../src/database/prisma";
import { hashPassword } from "../src/core/utils/password";

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
    update: {},
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
    update: {},
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
    update: {},
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
    update: {},
    create: {
      name: "Pilot Captain",
      mobile: "6666666666",
      passwordHash: captainPassword,
      role: UserRole.CAPTAIN,
      captainProfile: {
        create: {
          vehicleType: VehicleType.BIKE,
          isOnline: true
        }
      }
    },
    include: { captainProfile: true }
  });

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
