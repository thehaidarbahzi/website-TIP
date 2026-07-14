# AGENTS.md — website-TIP

## Stack

Next.js 16 (App Router) · React 19 · TypeScript 5 · Tailwind CSS 4 · PostCSS with `@tailwindcss/postcss` · ESLint 9 (`eslint-config-next/core-web-vitals` + `typescript`) · React Compiler (babel-plugin-react-compiler)

## Key dependencies

- **Firebase Admin SDK** (`firebase-admin`) — server-side RTDB access via `src/app/lib/server/firebase.ts`
- **Firebase** (`firebase`) — client-side SDK (present but not wired in routes yet)
- **jose** — JWT session cookies (HS256)
- **bcryptjs** — password hashing
- **zod 4** — form validation schemas
- **react-hook-form** + **@hookform/resolvers** — form management
- **gsap** + **lenis** — scroll-triggered animations
- **lucide-react** + **react-icons** — icons
- **googleapis** — Google Drive upload (service account)

## Commands

```sh
npm run dev      # next dev
npm run build    # next build
npm run start    # next start
npm run lint     # eslint
```

## Route structure

- `src/app/` — root layout, landing page, API routes, `(pages)/` for page routes, `(utils)/` for shared code
- Route groups: `(pages)/login/`, `(pages)/pendaftaran/`, `(pages)/dashboard/`
- API endpoints: `/api/registrations` (POST), `/api/registrations/byTeamName` (GET), `/api/upload` (POST), `/api/abstrak/submit` (POST)
- Path alias: `@/*` maps to `./src/*`

## Firebase Admin (server-side)

- **Source**: `src/app/lib/server/firebase.ts`
- Env vars required: `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`, `FIREBASE_DATABASE_URL`
- Private key newline normalization: `replace(/\\n/g, "\n")` is the standard gotcha; the env var must have literal `\n` which JS normalizes
- Exports `getFirebaseAdminApp()` and `getFirebaseAdminDb()` (Realtime Database)
- Uses global `__firebaseAdminInitialized` flag to prevent double-init

## Authentication

- **Sessions**: `src/app/lib/server/auth/sessions.ts` — jose HS256 JWT, httpOnly cookie (`session`), 1-day expiry, `secure: false` (not prod-safe)
- **Server action**: `src/app/lib/action/auth.ts` — `loginUser(formData)` validates with Zod, looks up `peserta/{teamName}` in RTDB, compares bcrypt hash, creates session, redirects to `/dashboard`
- **Session payload**: `{ user_id, user_name, user_role: "admin" | "juri" | "panitia" | "guest" }`

## Environment

- `.env.*` files are gitignored; a `.env.local` is expected locally
- `.env.local` is loaded automatically by Next.js (no dotenv package needed)

## Bugs / Known issues (fix before adding features)

1. **`loginUser` server action** — references undefined `payload` variable (`src/app/lib/action/auth.ts:46`)
2. **`registerFormSchema`** — references undefined `body` and `RegistrationPayload` (`src/app/(utils)/zod/auth.ts:24-31`)
3. **Dashboard layout** — references undefined `isActive()` function; `"use server"` directive inside a `"use client"` component is invalid
4. **Session cookie** — `secure: false` will break on production HTTPS
5. **`Navbar.tsx`** — dead code, superseded by `Navigation.tsx`

## Style

- Tailwind CSS 4 with `@theme` custom colors: `brand-purple`, `brand-orange`, `brand-purple-dark`, `brand-orange-dark`, `brand-pink`
- Glassmorphism via `glass-nav` class (`backdrop-filter: blur(12px)`, semi-transparent white bg)
- Sections use `.panel` (full viewport height) and `.panel-hidden` (clipped) classes
- Font: Montserrat (from Google Fonts), lang `"id"`
- GSAP + Lenis for scroll-driven animations (ScrollTrigger + smooth scrolling)
- Component patterns: Client components use `"use client"` directive; server actions use `"use server"` at function level only

## Testing

No test framework or test scripts found. All verification is manual via dev server.
