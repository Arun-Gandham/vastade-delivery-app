# Change Requests

Use this file for future full-stack changes.

## Change Request Template

```md
# Change Request — <Title>

## Date
YYYY-MM-DD

## Type
Backend / Frontend / Full-stack

## Requirement
Describe the change.

## Product Impact
Describe the user/business impact.

## API Impact
List API request/response changes.

## Backend Impact
List database, validation, service, repository, transaction, Swagger, and test changes.

## Frontend Impact
List page, component, API client, validation, state, and UI changes.

## Files to update
- docs/product/...
- docs/backend/...
- docs/frontend/...
```

## 2026-04-27 - Captain and delivery-task refactor

```txt
Captains now self-register instead of being created from admin/shop UI
Admin verifies legal documents and controls approval/rejection/blocking
Delivery is modeled through generic delivery_tasks
Parcel delivery joins the same captain engine as grocery delivery
Realtime captain offer events are now part of the architecture baseline
```
