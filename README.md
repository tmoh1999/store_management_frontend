# 🛒 StoreFlow — Full Stack POS System

A complete Point of Sale system built with **React + Flask**, designed for small to medium businesses. Manage products, sales, purchases, suppliers, customers, transactions, and refunds from a single clean interface.

---

## ✨ Features

- **Dashboard** — revenue, purchases, expenses stats with date range filter and sales chart
- **Products** — add, edit, remove, search with barcode scanner support
- **Sales** — create sales, add items by barcode or search, apply discounts, confirm or cancel
- **Purchases** — manage purchase orders with supplier selection and item tracking
- **Customers** — full customer management with sales history profile
- **Suppliers** — supplier management with purchase history profile
- **Transactions** — income/expense tracking with category and type filtering
- **Refunds** — create and manage refunds linked to original sales
- **Barcode Scanner** — scan product barcodes via device camera (Quagga.js)
- **Export** — export any table to Excel or PDF
- **JWT Auth** — secure login/register with automatic token expiry handling
- **Inline Editing** — edit table rows directly without leaving the page
- **Server-side** — pagination, search, sort on all tables

---

## 🛠 Tech Stack

**Frontend**
- React 18 + Vite
- React Router v6
- Tailwind CSS
- Chart.js / react-chartjs-2
- Quagga.js (barcode scanning)
- Lucide React (icons)

**Backend**
- Python / Flask
- SQLAlchemy
- JWT (PyJWT)
- Gunicorn (production)

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── api.js                  # All API calls
│   ├── App.jsx                 # Routes
│   ├── main.jsx                # Entry point
│   ├── DataTable.jsx           # Smart data table wrapper
│   ├── Table.jsx               # Presentation table component
│   ├── TransactionScreen.jsx   # Sale/Purchase item entry screen
│   ├── BarcodeScanner.jsx      # Camera barcode scanner
│   ├── components/             # Reusable UI components
│   └── pages/                  # All page components

backend/
├── app.py                      # Flask app entry
├── models.py                   # SQLAlchemy models
├── config.py                   # Configuration
└── api/                        # Blueprint routes
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+
- PostgreSQL (or SQLite for development)

### Frontend Setup

```bash
cd frontend
npm install
```

Create `.env`:
```dotenv
VITE_API_URL=http://localhost:5000
```

Run development server:
```bash
npm run dev
```

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
```

Create `.env` or set environment variables:
```dotenv
SECRET_KEY=your_secret_key
DATABASE_URL=postgresql://user:password@localhost/storeflow
```

Run development server:
```bash
flask run
```

---

## 🏭 Production Deployment

### 1. Build frontend
```bash
cd frontend
# Create .env.production
echo "VITE_API_URL=" > .env.production
npm run build
```

### 2. Serve with Flask
Copy `dist/` to your Flask project root, then add to `app.py`:

```python
from flask import send_from_directory
import os

@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve(path):
    if path and os.path.exists(os.path.join("dist", path)):
        return send_from_directory("dist", path)
    return send_from_directory("dist", "index.html")
```

### 3. Run with Gunicorn
```bash
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

---

## 🔑 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000` |
| `SECRET_KEY` | Flask JWT secret key | `your-secret-key` |
| `DATABASE_URL` | Database connection string | `postgresql://...` |

---

## 📸 Screenshots

> Add screenshots of Dashboard, Sales screen, and Product table here.

---

## 🗺 Roadmap

- [ ] Multi-user roles (admin, cashier, viewer)
- [ ] Multi-store support
- [ ] Low stock email/push notifications
- [ ] Mobile app (React Native)
- [ ] Unit tests (Jest + pytest)
- [ ] Docker deployment

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

## 👤 Author

Built with ❤️ — contributions and feedback welcome.
