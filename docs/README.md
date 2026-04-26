# Documentation

This folder contains the current implementation reference for the Quick Commerce repo.

## Structure

```txt
docs/
  product/              shared product truth and API contract
  backend/              backend implementation reference
  frontend/             frontend implementation reference
  _original-unchanged/  original source material kept for comparison
```

## Current platform state reflected here

- customer storefront with custom header, footer, location prompt, and nearby-shop-aware homepage
- direct-to-S3 image uploads through backend-issued presigned URLs
- database persistence of S3 object keys instead of full image URLs
- API responses that resolve browser-safe `imageUrl` fields for the frontend
- support for both public S3 buckets and private buckets with signed read URLs

## Recommended reading order

Full-stack:

1. `docs/product/README.md`
2. `docs/product/`
3. `docs/backend/README.md`
4. `docs/backend/`
5. `docs/frontend/README.md`
6. `docs/frontend/`

Backend-only:

1. `docs/product/README.md`
2. `docs/product/`
3. `docs/backend/README.md`
4. `docs/backend/`

Frontend-only:

1. `docs/product/README.md`
2. `docs/product/`
3. `docs/frontend/README.md`
4. `docs/frontend/`

## Notes

- The files under `docs/_original-unchanged/` are kept untouched for traceability.
- The files outside that folder should match the current codebase, not the earlier source material.
