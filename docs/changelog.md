## 2026-04-26 — Indtula pilot test changes added

### Type
Full-stack

### Status
Implemented

### Summary
Pilot test changes for Indtula integration and workflow updates completed today.

### Updated docs
- docs/product/03-user-flows.md
- docs/product/04-api-contracts.md
- docs/product/05-business-rules-statuses.md
- docs/backend/03-backend-architecture-standards.md
- docs/backend/05-transactions-testing-swagger-deployment.md

### Files changed
- backend/src/modules/orders/order.repository.ts
- backend/src/modules/orders/order.service.ts
- backend/src/modules/orders/order.controller.ts
- backend/src/modules/orders/order.validation.ts
- frontend/src/features/orders/IndtulaPilotTest.tsx
- frontend/src/features/orders/orders.api.ts
- frontend/src/app/orders/[orderId]/page.tsx

### Verification
- Indtula pilot test workflow executes as expected.
- Backend and frontend build successfully.
- All pilot test scenarios pass.

## 2026-04-26 - S3 image storage rollout

### Type
Full-stack

### Status
Implemented

### Summary
All image handling was moved off the backend/frontend servers to direct S3 uploads. Backend APIs now issue presigned upload targets, frontend forms upload local files directly to S3, and application records persist only the final image URL so the same APIs can be reused by mobile apps.

### Updated docs
- docs/backend/04-infrastructure-security-env.md
- docs/frontend/05-api-integration.md
- docs/frontend/06-state-forms-validation.md
- docs/frontend/CHANGELOG.md
- backend/README.md
- frontend/README.md

### Files changed
- backend/src/app.ts
- backend/src/config/env.ts
- backend/src/docs/swagger.ts
- backend/src/modules/uploads/upload.controller.ts
- backend/src/modules/uploads/upload.routes.ts
- backend/src/modules/uploads/upload.service.ts
- backend/src/modules/uploads/upload.types.ts
- backend/src/modules/uploads/upload.validation.ts
- backend/.env.example
- frontend/src/components/shared/image-upload-field.tsx
- frontend/src/features/uploads/upload.api.ts
- frontend/src/app/(admin)/admin/categories/page.tsx
- frontend/src/app/(admin)/admin/products/page.tsx
- frontend/src/app/(admin)/admin/settings/page.tsx
- frontend/src/app/(customer)/customer/profile/page.tsx
- frontend/src/app/(shop-owner)/shop-owner/profile/page.tsx
- frontend/src/app/(captain)/captain/orders/[orderId]/page.tsx

### Verification
- Backend no longer exposes a local static uploads directory.
- Image entry points now upload local files directly to S3 and save only returned URLs.
- Create and edit flows show image previews before and after upload.
