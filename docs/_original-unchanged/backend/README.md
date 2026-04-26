# Backend Specification Docs — Small-Scale Zepto / Instamart Clone

This folder replaces the old single large Markdown file with smaller topic-based Markdown files.

## Recommended reading order

1. [Overview](./01-overview.md)
2. [Database Entities](./02-database-entities.md)
3. [Enums](./03-enums.md)
4. [APIs — Auth, Profile, Addresses](./04-api-auth-profile-addresses.md)
5. [APIs — Catalog, Shops, Inventory, Cart](./05-api-catalog-shops-inventory-cart.md)
6. [APIs — Orders, Delivery, Payments](./06-api-orders-delivery-payments.md)
7. [APIs — Uploads, Notifications, Dashboards](./07-api-uploads-notifications-dashboards.md)
8. [Business Rules](./08-business-rules.md)
9. [Infrastructure, Security, Environment](./09-infrastructure-security-env.md)
10. [Access, MVP Scope, Development Standards](./10-access-mvp-development-standards.md)
11. [Transactions, Pagination, Testing, Swagger, Deliverables](./11-transactions-pagination-testing-swagger-deliverables.md)

## How to update in future

- Database table changes: update `02-database-entities.md`.
- Enum/status changes: update `03-enums.md`.
- API changes: update only the related API file.
- Order/inventory logic changes: update `08-business-rules.md`.
- Swagger, Docker, testing, and deployment changes: update `11-transactions-pagination-testing-swagger-deliverables.md`.

## Suggested project docs folder

```txt
docs/
  backend/
    README.md
    01-overview.md
    02-database-entities.md
    03-enums.md
    04-api-auth-profile-addresses.md
    05-api-catalog-shops-inventory-cart.md
    06-api-orders-delivery-payments.md
    07-api-uploads-notifications-dashboards.md
    08-business-rules.md
    09-infrastructure-security-env.md
    10-access-mvp-development-standards.md
    11-transactions-pagination-testing-swagger-deliverables.md
```
