# TODO - CORS and OAuth Fixes

## Fixed Issues
- ✅ CORS origin mismatch - added multiple origins support
- ✅ Added Cross-Origin-Opener-Policy and Cross-Origin-Embedder-Policy headers
- ✅ Fixed backend API URL in frontend render.yaml
- ✅ Added production fallback for API URL in frontend

## Changes Made

### 1. backend/src/index.ts
- Added multiple allowed origins for CORS (with and without www)
- Added credentials support in CORS
- Added COOP and COEP headers for OAuth support

### 2. frontend/src/api/client.ts
- Added production fallback for API URL
- Will use https://ytb-savings.onrender.com/api in production

### 3. frontend/render.yaml
- Fixed VITE_API_URL to point to correct backend URL

## Next Steps
- Push changes to GitHub
- Deploy to Render
- Test Google OAuth signup

