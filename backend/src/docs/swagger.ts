const bearerAuth = [{ bearerAuth: [] }];

const successResponse = {
  type: "object",
  properties: {
    success: { type: "boolean", example: true },
    message: { type: "string", example: "Success" },
    data: { type: "object", nullable: true },
    meta: { type: "object", nullable: true }
  }
};

const errorResponse = {
  type: "object",
  properties: {
    success: { type: "boolean", example: false },
    message: { type: "string", example: "Validation failed" },
    errorCode: { type: "string", example: "VALIDATION_ERROR" },
    errors: { type: "array", items: { type: "object" } }
  }
};

export const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "Quick Commerce API",
    version: "1.0.0",
    description:
      "Swagger documentation for the small-scale Zepto/Instamart clone backend. Use the Authorize button with a Bearer token to test protected APIs."
  },
  servers: [
    { url: "http://localhost:5000/api/v1", description: "Local" }
  ],
  tags: [
    { name: "Auth" },
    { name: "Users" },
    { name: "Addresses" },
    { name: "Shops" },
    { name: "Categories" },
    { name: "Products" },
    { name: "Inventory" },
    { name: "Cart" },
    { name: "Orders" },
    { name: "Captains" },
    { name: "Payments" },
    { name: "Coupons" },
    { name: "Notifications" },
    { name: "Uploads" },
    { name: "Dashboard" }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    },
    schemas: {
      SuccessResponse: successResponse,
      ErrorResponse: errorResponse
    }
  },
  paths: {
    "/auth/customer/register": {
      post: {
        tags: ["Auth"],
        summary: "Register customer",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "mobile", "password"],
                properties: {
                  name: { type: "string", example: "Arun" },
                  mobile: { type: "string", example: "9876543210" },
                  email: { type: "string", example: "arun@example.com" },
                  password: { type: "string", example: "Password@123" }
                }
              }
            }
          }
        },
        responses: { "200": { description: "OK" }, "400": { description: "Error", content: { "application/json": { schema: errorResponse } } } }
      }
    },
    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["mobile", "password"],
                properties: {
                  mobile: { type: "string", example: "9876543210" },
                  password: { type: "string", example: "Password@123" },
                  deviceType: { type: "string", example: "WEB" },
                  deviceId: { type: "string", example: "browser-1" },
                  fcmToken: { type: "string", example: "optional-token" }
                }
              }
            }
          }
        },
        responses: { "200": { description: "OK" } }
      }
    },
    "/auth/refresh-token": {
      post: {
        tags: ["Auth"],
        summary: "Refresh token",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["refreshToken"],
                properties: {
                  refreshToken: { type: "string" }
                }
              }
            }
          }
        },
        responses: { "200": { description: "OK" } }
      }
    },
    "/auth/logout": {
      post: {
        tags: ["Auth"],
        summary: "Logout",
        security: bearerAuth,
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["refreshToken"],
                properties: {
                  refreshToken: { type: "string" }
                }
              }
            }
          }
        },
        responses: { "200": { description: "OK" } }
      }
    },
    "/auth/change-password": {
      post: {
        tags: ["Auth"],
        summary: "Change password",
        security: bearerAuth,
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["oldPassword", "newPassword"],
                properties: {
                  oldPassword: { type: "string" },
                  newPassword: { type: "string" }
                }
              }
            }
          }
        },
        responses: { "200": { description: "OK" } }
      }
    },
    "/users/me": {
      get: {
        tags: ["Users"],
        summary: "Get profile",
        security: bearerAuth,
        responses: { "200": { description: "OK" } }
      },
      patch: {
        tags: ["Users"],
        summary: "Update profile",
        security: bearerAuth,
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  email: { type: "string" },
                  profileImage: { type: "string" }
                }
              }
            }
          }
        },
        responses: { "200": { description: "OK" } }
      }
    },
    "/customer/addresses": {
      get: {
        tags: ["Addresses"],
        summary: "List addresses",
        security: bearerAuth,
        responses: { "200": { description: "OK" } }
      },
      post: {
        tags: ["Addresses"],
        summary: "Create address",
        security: bearerAuth,
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["fullName", "mobile", "houseNo", "street", "village", "pincode", "addressType"],
                properties: {
                  fullName: { type: "string" },
                  mobile: { type: "string" },
                  houseNo: { type: "string" },
                  street: { type: "string" },
                  landmark: { type: "string" },
                  village: { type: "string" },
                  mandal: { type: "string" },
                  district: { type: "string" },
                  state: { type: "string" },
                  pincode: { type: "string" },
                  latitude: { type: "number" },
                  longitude: { type: "number" },
                  addressType: { type: "string", enum: ["HOME", "WORK", "OTHER"] },
                  isDefault: { type: "boolean" }
                }
              }
            }
          }
        },
        responses: { "200": { description: "OK" } }
      }
    },
    "/customer/addresses/{addressId}": {
      patch: {
        tags: ["Addresses"],
        summary: "Update address",
        security: bearerAuth,
        parameters: [{ in: "path", name: "addressId", required: true, schema: { type: "string", format: "uuid" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { type: "object" } } }
        },
        responses: { "200": { description: "OK" } }
      },
      delete: {
        tags: ["Addresses"],
        summary: "Delete address",
        security: bearerAuth,
        parameters: [{ in: "path", name: "addressId", required: true, schema: { type: "string", format: "uuid" } }],
        responses: { "200": { description: "OK" } }
      }
    },
    "/customer/addresses/{addressId}/default": {
      patch: {
        tags: ["Addresses"],
        summary: "Set default address",
        security: bearerAuth,
        parameters: [{ in: "path", name: "addressId", required: true, schema: { type: "string", format: "uuid" } }],
        responses: { "200": { description: "OK" } }
      }
    },
    "/shops/nearby": {
      get: {
        tags: ["Shops"],
        summary: "List nearby shops",
        parameters: [
          { in: "query", name: "village", schema: { type: "string" } },
          { in: "query", name: "pincode", schema: { type: "string" } }
        ],
        responses: { "200": { description: "OK" } }
      }
    },
    "/shops/{shopId}": {
      get: {
        tags: ["Shops"],
        summary: "Get shop details",
        parameters: [{ in: "path", name: "shopId", required: true, schema: { type: "string", format: "uuid" } }],
        responses: { "200": { description: "OK" } }
      }
    },
    "/admin/shops": {
      post: {
        tags: ["Shops"],
        summary: "Create shop",
        security: bearerAuth,
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["ownerId", "name", "mobile", "address", "village", "pincode"],
                properties: {
                  ownerId: { type: "string", format: "uuid" },
                  name: { type: "string" },
                  mobile: { type: "string" },
                  email: { type: "string" },
                  address: { type: "string" },
                  village: { type: "string" },
                  pincode: { type: "string" },
                  latitude: { type: "number" },
                  longitude: { type: "number" },
                  openingTime: { type: "string" },
                  closingTime: { type: "string" }
                }
              }
            }
          }
        },
        responses: { "200": { description: "OK" } }
      }
    },
    "/admin/shops/{shopId}": {
      patch: {
        tags: ["Shops"],
        summary: "Update shop",
        security: bearerAuth,
        parameters: [{ in: "path", name: "shopId", required: true, schema: { type: "string", format: "uuid" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { type: "object" } } }
        },
        responses: { "200": { description: "OK" } }
      }
    },
    "/shop-owner/shops/{shopId}/open-status": {
      patch: {
        tags: ["Shops"],
        summary: "Update shop open status",
        security: bearerAuth,
        parameters: [{ in: "path", name: "shopId", required: true, schema: { type: "string", format: "uuid" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["isOpen"],
                properties: {
                  isOpen: { type: "boolean" }
                }
              }
            }
          }
        },
        responses: { "200": { description: "OK" } }
      }
    },
    "/categories": {
      get: {
        tags: ["Categories"],
        summary: "List categories",
        responses: { "200": { description: "OK" } }
      }
    },
    "/admin/categories": {
      post: {
        tags: ["Categories"],
        summary: "Create category",
        security: bearerAuth,
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name"],
                properties: {
                  name: { type: "string" },
                  imageUrl: { type: "string" },
                  parentId: { type: "string", nullable: true },
                  sortOrder: { type: "integer" }
                }
              }
            }
          }
        },
        responses: { "200": { description: "OK" } }
      }
    },
    "/admin/categories/{categoryId}": {
      patch: {
        tags: ["Categories"],
        summary: "Update category",
        security: bearerAuth,
        parameters: [{ in: "path", name: "categoryId", required: true, schema: { type: "string", format: "uuid" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { type: "object" } } }
        },
        responses: { "200": { description: "OK" } }
      },
      delete: {
        tags: ["Categories"],
        summary: "Soft delete category",
        security: bearerAuth,
        parameters: [{ in: "path", name: "categoryId", required: true, schema: { type: "string", format: "uuid" } }],
        responses: { "200": { description: "OK" } }
      }
    },
    "/products": {
      get: {
        tags: ["Products"],
        summary: "List products",
        parameters: [
          { in: "query", name: "shopId", schema: { type: "string", format: "uuid" } },
          { in: "query", name: "categoryId", schema: { type: "string", format: "uuid" } },
          { in: "query", name: "search", schema: { type: "string" } },
          { in: "query", name: "page", schema: { type: "integer" } },
          { in: "query", name: "limit", schema: { type: "integer" } }
        ],
        responses: { "200": { description: "OK" } }
      }
    },
    "/products/{productId}": {
      get: {
        tags: ["Products"],
        summary: "Get product details",
        parameters: [{ in: "path", name: "productId", required: true, schema: { type: "string", format: "uuid" } }],
        responses: { "200": { description: "OK" } }
      }
    },
    "/admin/products": {
      post: {
        tags: ["Products"],
        summary: "Create product",
        security: bearerAuth,
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["categoryId", "name", "unit", "mrp", "sellingPrice"],
                properties: {
                  categoryId: { type: "string", format: "uuid" },
                  name: { type: "string" },
                  description: { type: "string" },
                  brand: { type: "string" },
                  unit: { type: "string" },
                  unitValue: { type: "number" },
                  mrp: { type: "number" },
                  sellingPrice: { type: "number" },
                  barcode: { type: "string" },
                  imageUrl: { type: "string" }
                }
              }
            }
          }
        },
        responses: { "200": { description: "OK" } }
      }
    },
    "/admin/products/{productId}": {
      patch: {
        tags: ["Products"],
        summary: "Update product",
        security: bearerAuth,
        parameters: [{ in: "path", name: "productId", required: true, schema: { type: "string", format: "uuid" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { type: "object" } } }
        },
        responses: { "200": { description: "OK" } }
      },
      delete: {
        tags: ["Products"],
        summary: "Soft delete product",
        security: bearerAuth,
        parameters: [{ in: "path", name: "productId", required: true, schema: { type: "string", format: "uuid" } }],
        responses: { "200": { description: "OK" } }
      }
    },
    "/shop-owner/shops/{shopId}/inventory": {
      get: {
        tags: ["Inventory"],
        summary: "List shop inventory",
        security: bearerAuth,
        parameters: [{ in: "path", name: "shopId", required: true, schema: { type: "string", format: "uuid" } }],
        responses: { "200": { description: "OK" } }
      }
    },
    "/shop-owner/shops/{shopId}/inventory/bulk": {
      post: {
        tags: ["Inventory"],
        summary: "Bulk inventory upsert",
        security: bearerAuth,
        parameters: [{ in: "path", name: "shopId", required: true, schema: { type: "string", format: "uuid" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["items"],
                properties: {
                  items: {
                    type: "array",
                    items: {
                      type: "object",
                      required: ["productId"],
                      properties: {
                        productId: { type: "string", format: "uuid" },
                        availableStock: { type: "integer" },
                        lowStockAlert: { type: "integer" },
                        isAvailable: { type: "boolean" }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        responses: { "200": { description: "OK" } }
      }
    },
    "/shop-owner/shops/{shopId}/inventory/{productId}": {
      put: {
        tags: ["Inventory"],
        summary: "Upsert inventory row",
        security: bearerAuth,
        parameters: [
          { in: "path", name: "shopId", required: true, schema: { type: "string", format: "uuid" } },
          { in: "path", name: "productId", required: true, schema: { type: "string", format: "uuid" } }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  availableStock: { type: "integer" },
                  lowStockAlert: { type: "integer" },
                  isAvailable: { type: "boolean" }
                }
              }
            }
          }
        },
        responses: { "200": { description: "OK" } }
      }
    },
    "/shop-owner/shops/{shopId}/inventory/{productId}/adjust": {
      post: {
        tags: ["Inventory"],
        summary: "Adjust inventory",
        security: bearerAuth,
        parameters: [
          { in: "path", name: "shopId", required: true, schema: { type: "string", format: "uuid" } },
          { in: "path", name: "productId", required: true, schema: { type: "string", format: "uuid" } }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["quantity", "adjustmentType"],
                properties: {
                  quantity: { type: "integer" },
                  adjustmentType: { type: "string", enum: ["ADD", "REMOVE", "SET", "DAMAGED"] },
                  remarks: { type: "string" }
                }
              }
            }
          }
        },
        responses: { "200": { description: "OK" } }
      }
    },
    "/cart": {
      get: {
        tags: ["Cart"],
        summary: "Get cart",
        security: bearerAuth,
        parameters: [{ in: "query", name: "shopId", required: true, schema: { type: "string", format: "uuid" } }],
        responses: { "200": { description: "OK" } }
      },
      delete: {
        tags: ["Cart"],
        summary: "Clear cart",
        security: bearerAuth,
        parameters: [{ in: "query", name: "shopId", required: true, schema: { type: "string", format: "uuid" } }],
        responses: { "200": { description: "OK" } }
      }
    },
    "/cart/items": {
      post: {
        tags: ["Cart"],
        summary: "Add cart item",
        security: bearerAuth,
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["shopId", "productId", "quantity"],
                properties: {
                  shopId: { type: "string", format: "uuid" },
                  productId: { type: "string", format: "uuid" },
                  quantity: { type: "integer" }
                }
              }
            }
          }
        },
        responses: { "200": { description: "OK" } }
      }
    },
    "/cart/items/{cartItemId}": {
      patch: {
        tags: ["Cart"],
        summary: "Update cart item",
        security: bearerAuth,
        parameters: [{ in: "path", name: "cartItemId", required: true, schema: { type: "string", format: "uuid" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["quantity"],
                properties: {
                  quantity: { type: "integer" }
                }
              }
            }
          }
        },
        responses: { "200": { description: "OK" } }
      },
      delete: {
        tags: ["Cart"],
        summary: "Delete cart item",
        security: bearerAuth,
        parameters: [{ in: "path", name: "cartItemId", required: true, schema: { type: "string", format: "uuid" } }],
        responses: { "200": { description: "OK" } }
      }
    },
    "/orders": {
      post: {
        tags: ["Orders"],
        summary: "Place order",
        security: bearerAuth,
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["shopId", "addressId", "paymentMode"],
                properties: {
                  shopId: { type: "string", format: "uuid" },
                  addressId: { type: "string", format: "uuid" },
                  paymentMode: { type: "string", enum: ["COD", "UPI_MANUAL", "RAZORPAY"] },
                  couponCode: { type: "string", nullable: true },
                  customerNotes: { type: "string" }
                }
              }
            }
          }
        },
        responses: { "200": { description: "OK" } }
      }
    },
    "/orders/my": {
      get: {
        tags: ["Orders"],
        summary: "List my orders",
        security: bearerAuth,
        parameters: [{ in: "query", name: "status", schema: { type: "string" } }],
        responses: { "200": { description: "OK" } }
      }
    },
    "/orders/{orderId}": {
      get: {
        tags: ["Orders"],
        summary: "Get order details",
        security: bearerAuth,
        parameters: [{ in: "path", name: "orderId", required: true, schema: { type: "string", format: "uuid" } }],
        responses: { "200": { description: "OK" } }
      }
    },
    "/orders/{orderId}/cancel": {
      post: {
        tags: ["Orders"],
        summary: "Customer cancel order",
        security: bearerAuth,
        parameters: [{ in: "path", name: "orderId", required: true, schema: { type: "string", format: "uuid" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["reason"],
                properties: {
                  reason: { type: "string" }
                }
              }
            }
          }
        },
        responses: { "200": { description: "OK" } }
      }
    },
    "/shop-owner/shops/{shopId}/orders": {
      get: {
        tags: ["Orders"],
        summary: "Shop owner list orders",
        security: bearerAuth,
        parameters: [{ in: "path", name: "shopId", required: true, schema: { type: "string", format: "uuid" } }],
        responses: { "200": { description: "OK" } }
      }
    },
    "/shop-owner/shops/{shopId}/orders/{orderId}": {
      get: {
        tags: ["Orders"],
        summary: "Shop owner order details",
        security: bearerAuth,
        parameters: [
          { in: "path", name: "shopId", required: true, schema: { type: "string", format: "uuid" } },
          { in: "path", name: "orderId", required: true, schema: { type: "string", format: "uuid" } }
        ],
        responses: { "200": { description: "OK" } }
      }
    },
    "/shop-owner/orders/{orderId}/accept": {
      patch: {
        tags: ["Orders"],
        summary: "Accept order",
        security: bearerAuth,
        parameters: [{ in: "path", name: "orderId", required: true, schema: { type: "string", format: "uuid" } }],
        responses: { "200": { description: "OK" } }
      }
    },
    "/shop-owner/orders/{orderId}/ready-for-pickup": {
      patch: {
        tags: ["Orders"],
        summary: "Mark ready for pickup",
        security: bearerAuth,
        parameters: [{ in: "path", name: "orderId", required: true, schema: { type: "string", format: "uuid" } }],
        responses: { "200": { description: "OK" } }
      }
    },
    "/shop-owner/orders/{orderId}/cancel": {
      post: {
        tags: ["Orders"],
        summary: "Shop owner cancel order",
        security: bearerAuth,
        parameters: [{ in: "path", name: "orderId", required: true, schema: { type: "string", format: "uuid" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["reason"],
                properties: { reason: { type: "string" } }
              }
            }
          }
        },
        responses: { "200": { description: "OK" } }
      }
    },
    "/shop-owner/orders/{orderId}/assign-captain": {
      post: {
        tags: ["Orders"],
        summary: "Shop owner assign captain",
        security: bearerAuth,
        parameters: [{ in: "path", name: "orderId", required: true, schema: { type: "string", format: "uuid" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["captainId"],
                properties: { captainId: { type: "string", format: "uuid" } }
              }
            }
          }
        },
        responses: { "200": { description: "OK" } }
      }
    },
    "/admin/orders": {
      get: {
        tags: ["Orders"],
        summary: "Admin list orders",
        security: bearerAuth,
        responses: { "200": { description: "OK" } }
      }
    },
    "/admin/orders/{orderId}": {
      get: {
        tags: ["Orders"],
        summary: "Admin order details",
        security: bearerAuth,
        parameters: [{ in: "path", name: "orderId", required: true, schema: { type: "string", format: "uuid" } }],
        responses: { "200": { description: "OK" } }
      }
    },
    "/admin/orders/{orderId}/accept": {
      patch: {
        tags: ["Orders"],
        summary: "Admin accept order",
        security: bearerAuth,
        parameters: [{ in: "path", name: "orderId", required: true, schema: { type: "string", format: "uuid" } }],
        responses: { "200": { description: "OK" } }
      }
    },
    "/admin/orders/{orderId}/ready-for-pickup": {
      patch: {
        tags: ["Orders"],
        summary: "Admin mark ready for pickup",
        security: bearerAuth,
        parameters: [{ in: "path", name: "orderId", required: true, schema: { type: "string", format: "uuid" } }],
        responses: { "200": { description: "OK" } }
      }
    },
    "/admin/orders/{orderId}/status": {
      patch: {
        tags: ["Orders"],
        summary: "Admin update order status",
        security: bearerAuth,
        parameters: [{ in: "path", name: "orderId", required: true, schema: { type: "string", format: "uuid" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["status"],
                properties: {
                  status: { type: "string" },
                  remarks: { type: "string" }
                }
              }
            }
          }
        },
        responses: { "200": { description: "OK" } }
      }
    },
    "/admin/orders/{orderId}/assign-captain": {
      post: {
        tags: ["Orders"],
        summary: "Admin assign captain",
        security: bearerAuth,
        parameters: [{ in: "path", name: "orderId", required: true, schema: { type: "string", format: "uuid" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["captainId"],
                properties: { captainId: { type: "string", format: "uuid" } }
              }
            }
          }
        },
        responses: { "200": { description: "OK" } }
      }
    },
    "/admin/captains/available": {
      get: {
        tags: ["Captains"],
        summary: "List available captains",
        security: bearerAuth,
        responses: { "200": { description: "OK" } }
      }
    },
    "/captains/register": {
      post: {
        tags: ["Captains"],
        summary: "Register captain",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "mobile", "password", "vehicleType"],
                properties: {
                  name: { type: "string" },
                  mobile: { type: "string" },
                  password: { type: "string" },
                  vehicleType: { type: "string", enum: ["BIKE", "CYCLE", "AUTO", "WALKING"] },
                  vehicleNumber: { type: "string" },
                  licenseNumber: { type: "string" }
                }
              }
            }
          }
        },
        responses: { "200": { description: "OK" } }
      }
    },
    "/captains/me": {
      get: {
        tags: ["Captains"],
        summary: "Get captain profile",
        security: bearerAuth,
        responses: { "200": { description: "OK" } }
      }
    },
    "/captains/me/online-status": {
      patch: {
        tags: ["Captains"],
        summary: "Update captain online status",
        security: bearerAuth,
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["isOnline"],
                properties: {
                  isOnline: { type: "boolean" },
                  latitude: { type: "number" },
                  longitude: { type: "number" }
                }
              }
            }
          }
        },
        responses: { "200": { description: "OK" } }
      }
    },
    "/captains/me/location": {
      patch: {
        tags: ["Captains"],
        summary: "Update captain location",
        security: bearerAuth,
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["latitude", "longitude"],
                properties: {
                  latitude: { type: "number" },
                  longitude: { type: "number" }
                }
              }
            }
          }
        },
        responses: { "200": { description: "OK" } }
      }
    },
    "/captains/orders/available": {
      get: {
        tags: ["Captains"],
        summary: "List available captain orders",
        security: bearerAuth,
        responses: { "200": { description: "OK" } }
      }
    },
    "/captains/orders/active": {
      get: {
        tags: ["Captains"],
        summary: "List active captain orders",
        security: bearerAuth,
        responses: { "200": { description: "OK" } }
      }
    },
    "/captains/orders/{orderId}/accept": {
      patch: {
        tags: ["Captains"],
        summary: "Captain accept order",
        security: bearerAuth,
        parameters: [{ in: "path", name: "orderId", required: true, schema: { type: "string", format: "uuid" } }],
        responses: { "200": { description: "OK" } }
      }
    },
    "/captains/orders/{orderId}/reject": {
      post: {
        tags: ["Captains"],
        summary: "Captain reject order",
        security: bearerAuth,
        parameters: [{ in: "path", name: "orderId", required: true, schema: { type: "string", format: "uuid" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["reason"],
                properties: {
                  reason: { type: "string" }
                }
              }
            }
          }
        },
        responses: { "200": { description: "OK" } }
      }
    },
    "/captains/orders/{orderId}/picked-up": {
      patch: {
        tags: ["Captains"],
        summary: "Captain mark order picked up",
        security: bearerAuth,
        parameters: [{ in: "path", name: "orderId", required: true, schema: { type: "string", format: "uuid" } }],
        responses: { "200": { description: "OK" } }
      }
    },
    "/captains/orders/{orderId}/delivered": {
      patch: {
        tags: ["Captains"],
        summary: "Captain deliver order",
        security: bearerAuth,
        parameters: [{ in: "path", name: "orderId", required: true, schema: { type: "string", format: "uuid" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  paymentCollected: { type: "boolean" },
                  collectedAmount: { type: "number" }
                }
              }
            }
          }
        },
        responses: { "200": { description: "OK" } }
      }
    },
    "/notifications": {
      get: {
        tags: ["Notifications"],
        summary: "List notifications",
        security: bearerAuth,
        responses: { "200": { description: "OK" } }
      }
    },
    "/notifications/{notificationId}/read": {
      patch: {
        tags: ["Notifications"],
        summary: "Mark notification as read",
        security: bearerAuth,
        parameters: [{ in: "path", name: "notificationId", required: true, schema: { type: "string", format: "uuid" } }],
        responses: { "200": { description: "OK" } }
      }
    },
    "/notifications/register-device": {
      post: {
        tags: ["Notifications"],
        summary: "Register device token",
        security: bearerAuth,
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["fcmToken", "deviceType"],
                properties: {
                  fcmToken: { type: "string" },
                  deviceType: { type: "string" }
                }
              }
            }
          }
        },
        responses: { "200": { description: "OK" } }
      }
    },
    "/uploads/image": {
      post: {
        tags: ["Uploads"],
        summary: "Create a direct image upload URL",
        security: bearerAuth,
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["filename", "contentType", "fileSize"],
                properties: {
                  filename: { type: "string", example: "product-photo.png" },
                  contentType: { type: "string", example: "image/png" },
                  fileSize: { type: "integer", example: 245760 },
                  folder: { type: "string", example: "products" }
                }
              }
            }
          }
        },
        responses: { "200": { description: "OK" } }
      }
    },
    "/payments/razorpay/create-order": {
      post: {
        tags: ["Payments"],
        summary: "Create Razorpay order",
        security: bearerAuth,
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["orderId"],
                properties: {
                  orderId: { type: "string", format: "uuid" }
                }
              }
            }
          }
        },
        responses: { "200": { description: "OK" } }
      }
    },
    "/payments/razorpay/verify": {
      post: {
        tags: ["Payments"],
        summary: "Verify Razorpay payment",
        security: bearerAuth,
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["orderId", "providerOrderId", "providerPaymentId"],
                properties: {
                  orderId: { type: "string", format: "uuid" },
                  providerOrderId: { type: "string" },
                  providerPaymentId: { type: "string" },
                  providerSignature: { type: "string" }
                }
              }
            }
          }
        },
        responses: { "200": { description: "OK" } }
      }
    },
    "/payments/manual-upi/mark-paid": {
      post: {
        tags: ["Payments"],
        summary: "Mark manual UPI payment paid",
        security: bearerAuth,
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["orderId", "transactionReference"],
                properties: {
                  orderId: { type: "string", format: "uuid" },
                  transactionReference: { type: "string" }
                }
              }
            }
          }
        },
        responses: { "200": { description: "OK" } }
      }
    },
    "/coupons/validate": {
      post: {
        tags: ["Coupons"],
        summary: "Validate coupon",
        security: bearerAuth,
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["shopId", "couponCode", "cartAmount"],
                properties: {
                  shopId: { type: "string", format: "uuid" },
                  couponCode: { type: "string" },
                  cartAmount: { type: "number" }
                }
              }
            }
          }
        },
        responses: { "200": { description: "OK" } }
      }
    },
    "/admin/coupons": {
      post: {
        tags: ["Coupons"],
        summary: "Create coupon",
        security: bearerAuth,
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["code", "discountType", "value", "validFrom", "validTo"],
                properties: {
                  code: { type: "string" },
                  description: { type: "string" },
                  discountType: { type: "string", enum: ["PERCENTAGE", "FLAT"] },
                  value: { type: "number" },
                  minOrderAmount: { type: "number" },
                  maxDiscount: { type: "number" },
                  usageLimit: { type: "integer" },
                  validFrom: { type: "string" },
                  validTo: { type: "string" },
                  isActive: { type: "boolean" }
                }
              }
            }
          }
        },
        responses: { "200": { description: "OK" } }
      }
    },
    "/admin/coupons/{couponId}": {
      patch: {
        tags: ["Coupons"],
        summary: "Update coupon",
        security: bearerAuth,
        parameters: [{ in: "path", name: "couponId", required: true, schema: { type: "string", format: "uuid" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { type: "object" } } }
        },
        responses: { "200": { description: "OK" } }
      },
      delete: {
        tags: ["Coupons"],
        summary: "Delete coupon",
        security: bearerAuth,
        parameters: [{ in: "path", name: "couponId", required: true, schema: { type: "string", format: "uuid" } }],
        responses: { "200": { description: "OK" } }
      }
    },
    "/admin/dashboard/summary": {
      get: {
        tags: ["Dashboard"],
        summary: "Admin dashboard summary",
        security: bearerAuth,
        responses: { "200": { description: "OK" } }
      }
    },
    "/admin/reports/sales": {
      get: {
        tags: ["Dashboard"],
        summary: "Admin sales report",
        security: bearerAuth,
        responses: { "200": { description: "OK" } }
      }
    },
    "/admin/reports/product-sales": {
      get: {
        tags: ["Dashboard"],
        summary: "Admin product sales report",
        security: bearerAuth,
        responses: { "200": { description: "OK" } }
      }
    },
    "/admin/reports/low-stock": {
      get: {
        tags: ["Dashboard"],
        summary: "Admin low stock report",
        security: bearerAuth,
        responses: { "200": { description: "OK" } }
      }
    },
    "/shop-owner/shops/{shopId}/dashboard/summary": {
      get: {
        tags: ["Dashboard"],
        summary: "Shop dashboard summary",
        security: bearerAuth,
        parameters: [{ in: "path", name: "shopId", required: true, schema: { type: "string", format: "uuid" } }],
        responses: { "200": { description: "OK" } }
      }
    },
    "/shop-owner/shops/{shopId}/reports/sales": {
      get: {
        tags: ["Dashboard"],
        summary: "Shop sales report",
        security: bearerAuth,
        parameters: [{ in: "path", name: "shopId", required: true, schema: { type: "string", format: "uuid" } }],
        responses: { "200": { description: "OK" } }
      }
    },
    "/shop-owner/shops/{shopId}/reports/low-stock": {
      get: {
        tags: ["Dashboard"],
        summary: "Shop low stock report",
        security: bearerAuth,
        parameters: [{ in: "path", name: "shopId", required: true, schema: { type: "string", format: "uuid" } }],
        responses: { "200": { description: "OK" } }
      }
    }
  }
};
