# Components and UI Layouts

## Required UI components

```txt
Button
Input
Textarea
Select
Checkbox
Radio
Switch
Badge
Card
Dialog
Drawer
BottomSheet
Tabs
Table
Pagination
Skeleton
Toast
EmptyState
ErrorState
LoadingSpinner
ConfirmDialog
ImageUpload
DateRangePicker
SearchInput
StatusBadge
PriceText
QuantityStepper
```

## Layout components

```txt
PublicNavbar
PublicStorefrontSections
AuthLayout
CustomerAppShell
CustomerBottomNav
CaptainAppShell
CaptainBottomNav
DashboardSidebar
DashboardTopbar
MobileDrawer
PageHeader
PageContainer
SectionHeader
```

## Customer components

```txt
CustomerStorefrontHeader
CustomerFooter
CustomerLocationBanner
LocationSelector
CategoryChip
CategoryGrid
ShopCard
ProductCard
ProductGrid
CartItemCard
CartSummary
CheckoutSummary
AddressCard
AddressForm
PaymentModeSelector
CouponBox
OrderCard
OrderTimeline
OrderStatusBadge
```

## Shop owner components

```txt
ShopSelector
ShopStatusToggle
ShopDashboardStats
InventoryTable
InventoryCard
StockAdjustDialog
ShopOrderTable
ShopOrderCard
ShopOrderActions
LowStockAlert
SalesChart
```

## Captain components

```txt
CaptainOnlineToggle
CaptainOrderCard
PickupInfoCard
DeliveryInfoCard
CODCollectionCard
DeliveryActionBar
DeliveryProofUpload
CaptainStatsCard
```

## Admin components

```txt
AdminStatsGrid
AdminOrderTable
AdminProductTable
AdminCategoryTable
AdminShopTable
AdminCouponTable
AdminCaptainTable
ReportFilterBar
SalesReportChart
LowStockTable
```

## UI behavior

Desktop uses tables for admin/shop owner lists. Mobile uses cards and bottom sheets. Every page must have skeleton loading, empty state, error retry state, and content state.

Customer storefront behavior:

```txt
Header must expose search, cart, location context, and login/logout affordances
Header and footer should be full-width shared storefront components reused across customer pages
Footer should be compact, lighter, and expose navigation, support contact, and category shortcuts
Customer home should remain usable even when persisted selected shop state becomes stale
Location prompt should appear only when no saved delivery context exists
```

Public storefront behavior:

```txt
Public header should expose branding, delivery context, search, login, and cart entry
Public landing page should render categories and product sections from live frontend queries
Public footer should expose links, support details, and category shortcuts
```

Dashboard behavior:

```txt
Admin, shop-owner, and super-admin screens should inherit one shared enterprise shell
Sidebar should feel stable and premium rather than default utility navigation
Topbar should expose role context, current user, and logout in a compact control surface
Captain and customer mobile bottom navigation should use the same polished floating navigation language
```
