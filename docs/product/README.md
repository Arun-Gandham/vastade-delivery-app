# Product Documentation - Shared Source of Truth

This folder contains the shared product requirements used by both backend and frontend.

Use this folder for:

```txt
roles
permissions
MVP scope
user flows
API contracts
business rules
statuses and enums
full-stack change requests
```

## Reading order

1. [Product Overview](./01-product-overview.md)
2. [Roles, Permissions, and MVP Scope](./02-roles-permissions-mvp-scope.md)
3. [User Flows](./03-user-flows.md)
4. [API Contracts](./04-api-contracts.md)
5. [Business Rules and Statuses](./05-business-rules-statuses.md)
6. [Change Requests](./06-change-requests.md)

## Update rule

- API changed: update `04-api-contracts.md`
- Business rule changed: update `05-business-rules-statuses.md`
- User flow changed: update `03-user-flows.md`
- Role or MVP scope changed: update `02-roles-permissions-mvp-scope.md`
- New full-stack change: add an entry in `06-change-requests.md`
- Captain or dispatch architecture changed: update `03-user-flows.md`, `04-api-contracts.md`, and `05-business-rules-statuses.md` together
