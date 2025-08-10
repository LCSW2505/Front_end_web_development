## Charan Devaraju
## c0943138
## Project-02
# Technical Documentation — Stack's Stationery Shop

## High-level Architecture

This project appears to follow a standard web app architecture:

- **Frontend**: HTML, CSS, and JavaScript files (static files under `public`, `src`, or root).
- **Backend** (optional): Node.js + Express server (look for `server.js`, `app.js`, `routes` folders).

## Detected Technologies & Dependencies

-  `product.json` dependencies detected.

No explicit database library detected in scanned JS files. The project may use static JSON files or browser storage.


## API Endpoints (discovered by scanning .js files)

- `FETCH /data/products.json`  — defined in `StationeryShop/js/app.js`

## Inferred Database Schema (heuristic)

- **Product**: `id`, `name`, `description`, `price`, `image`, `category`, `stock`.

## Environment & Config
- Check for `.env` or config files for DB connection strings and secret keys.

## Build & Deployment
- For Node.js: `npm install` then `npm start` or `npm run build` (if SSR or bundler present).
- For static-only: deploy to any static host (GitHub Pages, Netlify) by copying `public` folder.

