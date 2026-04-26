# Zepto Frontend MVP

Production-ready MVP for a quick-commerce grocery delivery platform.

## Tech Stack
- Next.js 15+
- TypeScript
- Tailwind CSS
- shadcn/ui patterns
- lucide-react
- TanStack Query
- Zustand
- react-hook-form + zod
- axios

## Structure
- src/app: App routes and layouts
- src/components: Reusable UI components
- src/config: Theme, API, and other configs
- src/lib: API client and utilities
- src/features: Typed API modules, hooks, and validations

## Setup
1. Copy `.env.example` to `.env` and fill values
2. `npm install`
3. `npm run dev`

## Deployment
- See Dockerfile for production build

## Verification
- `npm run lint`
- `npm test`
- `npm run build`

## Image Uploads
- Frontend requests authenticated presigned upload details from the backend.
- Selected files upload directly from the client to S3.
- Forms store only the returned remote image URL and reuse the same contract for future mobile clients.
