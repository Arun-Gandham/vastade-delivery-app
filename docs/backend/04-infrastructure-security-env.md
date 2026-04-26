# Infrastructure, Security, Environment

# 11. Middleware Requirements

```txt
requestLogger
errorHandler
authMiddleware
roleMiddleware
validateRequestMiddleware
rateLimitMiddleware
corsMiddleware
helmetSecurityMiddleware
```

---

---

# 12. Error Codes

```txt
AUTH_INVALID_CREDENTIALS
AUTH_TOKEN_EXPIRED
AUTH_UNAUTHORIZED
AUTH_FORBIDDEN
USER_NOT_FOUND
SHOP_NOT_FOUND
PRODUCT_NOT_FOUND
CATEGORY_NOT_FOUND
CART_EMPTY
CART_ITEM_NOT_FOUND
INSUFFICIENT_STOCK
ORDER_NOT_FOUND
INVALID_ORDER_STATUS
PAYMENT_FAILED
CAPTAIN_NOT_FOUND
CAPTAIN_NOT_AVAILABLE
COUPON_INVALID
VALIDATION_ERROR
INTERNAL_SERVER_ERROR
```

---

---

# 13. Background Jobs

Use BullMQ + Redis.

```txt
sendOrderNotificationJob
sendDeliveryAssignmentNotificationJob
sendOrderDeliveredNotificationJob
cancelUnpaidOrderJob
lowStockAlertJob
```

---

---

# 14. Real-Time Events

For MVP, polling is acceptable. Later use Socket.IO.

```txt
order.created
order.status.updated
order.assigned
captain.location.updated
payment.updated
inventory.low_stock
```

---

---

# 15. Security Requirements

```txt
Use HTTPS in production
Hash passwords using bcrypt
Never store plain passwords
Use JWT expiry
Use refresh token rotation
Use Helmet
Enable CORS only for allowed domains
Rate limit auth APIs
Validate all request bodies
Issue presigned S3 upload URLs from authenticated backend APIs
Validate upload intent payloads before signing
Restrict uploads to approved image mime types
Limit image size before issuing upload URLs
Persist only S3 object keys in database records
Resolve browser-safe image URLs in API responses
Use signed GET URLs when the bucket is private
Do not proxy or permanently store uploaded images on the backend server
Use parameterized DB queries through Prisma
Do not expose stack traces in production
Store secrets in environment variables
```

---

---

# 16. Environment Variables

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=mysql://user:password@localhost:5432/quick_commerce
REDIS_URL=redis://localhost:6379
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=30d
BCRYPT_SALT_ROUNDS=12
CORS_ORIGIN=http://localhost:3000
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
S3_ACCESS_KEY=
S3_SECRET_KEY=
S3_BUCKET=
S3_REGION=
S3_ENDPOINT=
S3_PUBLIC_BASE_URL=
S3_KEY_PREFIX=
S3_UPLOAD_URL_EXPIRES_IN=300
S3_READ_URL_EXPIRES_IN=3600
S3_BUCKET_PUBLIC=false
WHATSAPP_API_TOKEN=
SMS_API_KEY=
```

## 17. Direct Upload Flow

```txt
1. Client sends authenticated upload intent to backend with filename, contentType, and folder.
2. Backend validates mime type, file size policy, and S3 configuration.
3. Backend returns a presigned PUT URL, the final object key, and a browser-safe preview imageUrl.
4. Web or mobile client uploads the file directly to S3.
5. Client stores only the returned object key in profile/category/product/order payloads.
6. Read APIs return both the stored key and a browser-safe imageUrl.
```

## 18. Public vs Private Bucket Read Logic

```txt
If S3_BUCKET_PUBLIC=true:
  imageUrl = S3_PUBLIC_BASE_URL + "/" + normalized relative key when needed

If S3_BUCKET_PUBLIC=false:
  backend returns a presigned GET URL with inline content disposition
```

## 19. Suggested S3 CORS

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "HEAD"],
    "AllowedOrigins": [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://yourdomain.com"
    ],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

---
