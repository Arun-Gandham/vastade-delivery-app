# Responsive, Performance, SEO, and Accessibility

## Mobile-first rules

Customer and captain screens must work well on 360px Android phones, 390px iPhones, 430px large phones, tablets, laptops, and desktops.

## Responsive behavior

Customer: bottom nav on mobile, product grid, sticky cart bar. Captain: bottom nav, large action buttons, one-column task cards. Admin/shop owner: sidebar on desktop, drawer on mobile, tables on desktop, cards on mobile.

Typography and sizing should scale with the newer public-page design system:

```txt
Large hero text should compress cleanly on tablet and mobile without wrapping into unreadable blocks
Header search bars should remain visually dominant but fit smaller screens without overflow
Compact footers should stay dense and readable on mobile instead of becoming tall stacked sections
Dashboard sidebars and topbars should preserve hierarchy while reducing padding on smaller laptops
Floating mobile bottom navigation should remain thumb-friendly without consuming excessive height
```

## Performance

Use Next.js Image, lazy load images, pagination/infinite scroll, query caching, skeleton loading, route-level code splitting, and avoid unnecessary re-renders.

## SEO

Add metadata for home, shops, products, product details, about, and contact. Private dashboard pages should be noindex/nofollow.

## Accessibility

Use semantic HTML, labels, aria-label for icon buttons, keyboard navigation, visible focus states, sufficient color contrast, alt text, and clear error messages.

## Prevent duplicate actions

Disable buttons while processing place order, cancel order, mark delivered, assign captain, stock adjust, and payment verify.
