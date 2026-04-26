# State Management, Forms, and Validation

## State tools

```txt
Server state: TanStack Query
Client UI state: Zustand or Context
Form state: react-hook-form
Validation: zod
Auth state: AuthProvider + storage helper
Theme state: config/CSS variables
```

## Server state

Use TanStack Query for products, shops, cart, orders, dashboard summaries, notifications, addresses, and inventory.

## Client state

Use Zustand or Context for auth user, selected shop, selected address, cart summary, sidebar open/close, mobile bottom sheet state, and theme config.

## Form validation schemas

Create zod schemas for login, customer register, captain register, profile update, address create/update, category create/update, product create/update, shop create/update, inventory update, stock adjust, cart item add/update, place order, cancel order, captain delivered, coupon create/update, and manual UPI mark paid.

## UX rules

Every form must have labels, placeholders, validation errors, disabled submit while loading, loading spinner, success toast, error toast, and cancel/back button.

Image-specific UX rules:

```txt
Use local file pickers instead of manual URL entry
Show a local preview immediately after file selection
Keep showing the saved remote preview when editing an existing record
Upload directly to S3 before final form submission
Store only the returned image URL in form state
Allow replacing or clearing an uploaded image before save
```

## Table state

Admin and shop owner tables should support pagination, search, sort, filters, loading state, empty state, and row actions.

## Confirmation dialogs

Use confirmation dialogs for delete address, delete category, delete product, cancel order, clear cart, assign captain, mark delivered, stock adjustment, and logout.
