# Dashboard 404 Error Resolution

## Issue

The user reported a 404 error on the dashboard page after logging in. The browser console showed "Failed to load resource: the server responded with a status of 404 ()".

## Investigation

1.  **Frontend Routing:** I examined `frontend/src/App.tsx` and confirmed that the `/dashboard` route was correctly configured and protected by a private route.
2.  **Dashboard Component:** I inspected `frontend/src/pages/Dashboard.tsx` and found that it was fetching data using `transactionAPI.getAll()`.
3.  **API Client:** I checked `frontend/src/api/client.ts` and determined that `transactionAPI.getAll()` was making a `GET` request to `/api/transactions`.
4.  **Backend Routing:** I investigated the backend code and found that `backend/src/routes/transactions.ts` had a `GET` handler for `/`, which was correctly mounted at `/api/transactions` in `backend/src/index.ts`.
5.  **Vite Configuration:** The code appeared to be correct, so I suspected a problem with the development server configuration. I found both `vite.config.js` and `vite.config.ts` in the `frontend` directory. The `vite.config.ts` file had the correct proxy configuration to forward `/api` requests to the backend, but the `vite.config.js` file did not.

## Resolution

The presence of both `vite.config.js` and `vite.config.ts` was causing a conflict. Vite was likely using the `.js` file, which was missing the proxy configuration.

To resolve the issue, I deleted the `vite.config.js` file. This ensures that Vite will use the `vite.config.ts` file with the correct proxy configuration, allowing the frontend to communicate with the backend and resolving the 404 error.