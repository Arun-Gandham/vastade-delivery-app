# Authentication and Role-Based Access

## Supported roles

```txt
SUPER_ADMIN
ADMIN
SHOP_OWNER
STORE_MANAGER
CUSTOMER
CAPTAIN
```

## Login API

```http
POST /auth/login
```

After login:

```txt
Store tokens
Load user profile if needed
Redirect based on role
```

## Role redirect rules

```txt
CUSTOMER      -> /customer
CAPTAIN       -> /captain
SHOP_OWNER    -> /shop-owner
STORE_MANAGER -> /shop-owner
ADMIN         -> /admin
SUPER_ADMIN   -> /admin or /super-admin
```

## Route protection

Create:

```txt
AuthProvider
ProtectedRoute
RoleGuard
```

Rules:

```txt
Unauthenticated user -> /login
Wrong role -> /unauthorized
Expired access token -> refresh token
Refresh token expired -> logout
```

## Auth pages

Login fields:

```txt
mobile
password
deviceType
fcmToken optional
```

Register customer fields:

```txt
name
mobile
email optional
password
confirmPassword
```

Captain registration fields:

```txt
name
mobile
password
vehicleType
vehicleNumber
licenseNumber
```

## Logout

Use:

```http
POST /auth/logout
```

Then clear frontend auth state and redirect to `/login`.

## Change password

Use:

```http
POST /auth/change-password
```

## Unauthorized page

Create `/unauthorized` with message, go back button, dashboard button, and logout button.
