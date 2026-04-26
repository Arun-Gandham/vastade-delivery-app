# Product Overview

This repository implements a quick-commerce grocery delivery MVP for a local pilot.

## Platform scope

The system supports:

- customer web app
- future customer mobile app
- captain or delivery partner app
- shop owner or store manager panel
- admin and super-admin web panel

## Backend product direction

Recommended backend stack:

```txt
Runtime: Node.js
Language: TypeScript
Framework: Express.js
Database: MySQL
ORM: Prisma
Cache: Redis
Queue: BullMQ
Authentication: JWT + Refresh Token
Validation: Zod
File Storage: S3 with presigned upload and read URLs
Logging: Pino or Winston
API Docs: Swagger or OpenAPI
Deployment: Docker + Nginx
```

## Frontend product direction

Recommended frontend shape:

```txt
Single Next.js codebase
Role-based route protection
Mobile-first customer and captain flows
Desktop-friendly admin and shop-owner panels
Branded customer storefront for the public shopping experience
```

## MVP goals

- customers can browse nearby shops and products
- customers can manage addresses and place orders
- customers can track recent orders
- shop owners can manage inventory and order handling
- captains can accept and deliver assigned orders
- admins can manage catalog, orders, shops, captains, and reports

## Current implementation notes

- The customer homepage uses a custom storefront header and footer.
- Location prompting appears when there is no saved delivery context.
- Nearby shop selection falls back safely if persisted state becomes stale.
- Images upload directly to S3.
- The database stores only S3 object keys.
- Read APIs return browser-safe image URLs for rendering.
