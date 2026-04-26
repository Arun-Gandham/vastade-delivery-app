# APIs — Auth, Profile, Addresses

# 9. API Endpoints

---

# 9.1 Auth APIs

## Register Customer

```http
POST /auth/customer/register
```

Request:

```json
{
  "name": "Arun",
  "mobile": "9876543210",
  "email": "arun@example.com",
  "password": "Password@123"
}
```

---

## Login

```http
POST /auth/login
```

Request:

```json
{
  "mobile": "9876543210",
  "password": "Password@123",
  "deviceType": "WEB",
  "fcmToken": "optional"
}
```

Response:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token",
    "user": {
      "id": "uuid",
      "name": "Arun",
      "mobile": "9876543210",
      "role": "CUSTOMER"
    }
  }
}
```

---

## Refresh Token

```http
POST /auth/refresh-token
```

Request:

```json
{
  "refreshToken": "refresh_token"
}
```

---

## Logout

```http
POST /auth/logout
```

Auth required: Yes

---

## Change Password

```http
POST /auth/change-password
```

Auth required: Yes

Request:

```json
{
  "oldPassword": "Old@123",
  "newPassword": "New@123"
}
```

---

---

# 9.2 Profile APIs

```http
GET /users/me
PATCH /users/me
```

Update request:

```json
{
  "name": "Arun Sai",
  "email": "arun@example.com",
  "profileImage": "image_url"
}
```

---

---

# 9.3 Customer Address APIs

```http
POST /customer/addresses
GET /customer/addresses
PATCH /customer/addresses/:addressId
DELETE /customer/addresses/:addressId
PATCH /customer/addresses/:addressId/default
```

Create request:

```json
{
  "fullName": "Arun",
  "mobile": "9876543210",
  "houseNo": "1-23",
  "street": "Main Road",
  "landmark": "Near Temple",
  "village": "My Village",
  "mandal": "Mandal Name",
  "district": "District Name",
  "state": "Andhra Pradesh",
  "pincode": "533001",
  "latitude": 16.1234567,
  "longitude": 82.1234567,
  "addressType": "HOME",
  "isDefault": true
}
```

---

---
