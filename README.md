# ServeSmart

Vite + React app prepared for Vercel. The demo uses browser localStorage rather than a localhost API, so changes persist in the browser where they were made.

## Run locally
1. Install Node.js LTS.
2. Open this folder in a terminal.
3. Run `npm install`.
4. Run `npm run dev`.

## Deploy
Push this folder to GitHub and import the repository at https://vercel.com/new. Vercel should detect Vite. Build command: `npm run build`; output directory: `dist`.

Note: localStorage is browser-specific; data is not shared across users/devices and is not a cloud database.
