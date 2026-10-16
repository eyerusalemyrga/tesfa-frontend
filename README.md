# Tesfa Frontend

Next.js 15 (App Router) + TypeScript + Tailwind, tested with Jest + Testing Library.

## Getting started

```bash
echo "BASE_URL=http://localhost:8000/api" > .env.local   # address of the Tesfa backend
npm install
npm run dev                  # http://localhost:3000
npm test
```

## How data flows

```
page.tsx  →  hooks/useFetchX.ts  →  utils/fetchX.ts  →  /api/x (route.ts)  →  BASE_URL/x/ (backend)
```

| Layer | Folder | Job |
|---|---|---|
| Route | `src/app/api/<name>/route.ts` | Runs on the server. A one-liner that calls `forward()` (`api/forward.ts`), which passes the request and its `Authorization: Bearer <token>` header on to `BASE_URL`. |
| Fetch | `src/app/utils/fetchX.ts` | Runs in the browser. Calls `/api/<name>` through `apiFetch` (`utils/apiClient.ts`), which adds the token, refreshes it once when it expires, and throws the backend's error message. |
| Hook | `src/app/hooks/useFetchX.ts` | Wraps the fetch with `loading` / `error` / data state for pages. |
| Types | `src/app/utils/types/` | Shapes of the data the backend returns. |

Login returns JWTs (`access`, `refresh`) and the user. `utils/session.ts` keeps them in `localStorage`; `hooks/useSession` gives pages the current user.

## Pages

| Path | Who | What |
|---|---|---|
| `/` | Everyone | Chat with Tesfa AI. Guests see Log in / Create account on the right; signed-in users get saved history in the sidebar. |
| `/signin`, `/signup`, `/forgot-password` | Everyone | Auth. Sign-up creates a Health Professional. |
| `/insights` | Signed in | Graphs from `/graphs/` (filter by country) and charts from past answers (`/charts/`). |
| `/account` | Signed in | Edit own profile and password. |
| `/admin` | Admin | Usage overview: users, conversations, charts. |
| `/admin/users` | Admin | Search, add, activate/deactivate, delete users. |
| `/admin/queries` | Admin | Every conversation; open one to read the thread. |

Route guards live in `sharedComponents/AppShell.tsx` (`publicPaths`, `/admin*` needs an Admin).

## Adding a new endpoint

1. `src/app/api/<name>/route.ts`: `export const GET = (request: Request) => forward(request, "/<name>/");`
2. `src/app/utils/fetch<Name>.ts`: `apiFetch<Type>("/api/<name>")`.
3. `src/app/hooks/useFetch<Name>.ts`: wrap it with `useFetch` (see `hooks/useFetchUsers.ts`).
4. Add the type to `src/app/utils/types/`.
5. Add a test next to the fetch file (see `utils/apiClient.test.ts`).

## Adding a new page

Create `src/app/<page>/page.tsx` (and `page.test.tsx`, plus a `components/` folder if needed). Add the link to `sharedComponents/Sidebar`. Pages that should not show the sidebar go in `hideSidebarPaths` in `sharedComponents/AppShell.tsx`.
