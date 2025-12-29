# Agri Frontend (Vite + React)

Minimal React frontend scaffold that talks to your existing backend.

Getting started:

1. Open a terminal and change to the frontend folder:

```powershell
cd Frontend
```

2. Install dependencies:

```powershell
npm install
```

3. Copy `.env.example` to `.env` and set `VITE_API_URL` to your backend, e.g. `http://localhost:5000`.

4. Run the dev server:

```powershell
npm run dev
```

The dev server runs on `http://localhost:3000` by default. The `Products` page will attempt to fetch product data from `${VITE_API_URL}/api/products` and fallback to `${VITE_API_URL}/products`.

Next steps you may want me to do:
- Add routing with `react-router-dom`.
- Add authentication and login pages to match the backend routes.
- Build product listing, product detail, cart and checkout flows.

If you want, I can wire up specific backend endpoints (auth, cart, orders) next.