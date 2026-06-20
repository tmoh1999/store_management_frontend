# 🛒 Store Management Frontend

Frontend-only React application for a point-of-sale / inventory management system. The working app lives in `store_management_front/` and connects to an external backend API via `VITE_API_URL`.

---

## ✨ Features

- **Dashboard** — overview of revenue, sales, purchases, and other key metrics
- **Products** — add, edit, remove, search, and view product details
- **Sales** — create and manage sales, including item selection and order review
- **Purchases** — track purchase orders and supplier-linked receipts
- **Customers** — manage customers and view customer history
- **Suppliers** — manage suppliers and view supplier profile data
- **Transactions** — income/expense recording and filtering
- **Refunds** — create refunds and review refund details
- **Barcode Scanner** — scan product barcodes using device camera (Quagga)
- **Protected routes** — login/register with token-based auth guard
- **Export support** — download data from the app as needed

---

## 🛠 Tech Stack

- React 19 + Vite
- React Router v7
- Tailwind CSS
- Chart.js + react-chartjs-2
- Quagga barcode scanner
- Lucide React icons
- React Select
- Jest + Testing Library for tests

---

## 📁 Repository Layout

```
store_management_front/
├── src/
│   ├── api.js
│   ├── App.jsx
│   ├── main.jsx
│   ├── BarcodeScanner.jsx
│   ├── DataTable.jsx
│   ├── Table.jsx
│   ├── SideBar.jsx
│   ├── components/
│   └── pages/
├── __tests__/
├── package.json
├── vite.config.js
├── tailwind.config.cjs
└── postcss.config.cjs
```

> Note: this repository contains only the frontend app. A backend API is required separately.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm

### Install dependencies

```bash
cd store_management_front
npm install
```

### Configure API URL

Create a `.env` file in `store_management_front/`:

```dotenv
VITE_API_URL=http://localhost:5000
```

Update the URL to point to your backend API.

### Run development server

```bash
npm run dev
```

---

## 📦 Available Scripts

From inside `store_management_front/`:

- `npm run dev` — start the Vite development server
- `npm run build` — build production assets
- `npm run preview` — preview production build locally
- `npm run test` — run Jest tests
- `npm run lint` — run ESLint

---

## 🔧 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Base URL for backend API | `http://localhost:5000` |

---

## 🧭 Notes

- The backend API is not included in this repo.
- Ensure the API supports authentication and the endpoints used by `store_management_front/src/api.js`.

---

## 📄 License

MIT License — free to use, modify, and distribute.
