# 🌸 Kansara Creation — Credentials & Website Paths Reference

This document contains all URLs, routes, admin credentials, environment configurations, and API endpoints for the **Kansara Creation** web application.

---

## 🔑 Administrative Credentials

| Service / Portal | Field | Value | Notes |
|---|---|---|---|
| **Admin Portal** | Login URL | [http://localhost:3000/admin/login](http://localhost:3000/admin/login) | Protected by JWT HTTP-only cookie |
| **Admin Account** | Email | `admin@kansara.com` | Seeded master administrator |
| **Admin Account** | Password | `Admin@123` | Encrypted using bcrypt (10 rounds) |
| **Session Cookie** | Cookie Name | `kc_admin_token` | Valid for 7 days (`maxAge: 604800`) |
| **JWT Secret** | Key | `kansara_craft_secure_jwt_secret_key_2026_xyz` | Defined in `.env` |

> ⚠️ **Security Notice**: Remember to change the default admin password in production.

---

## 🌐 Website Pages & Customer Routes

| Route | Page Name | Description | Key Features |
|---|---|---|---|
| `/` | **Storefront Home** | [http://localhost:3000/](http://localhost:3000/) | 3D Interactive Hoop with mouse parallax, categories, featured creations, brand story, Instagram feed, customer reviews |
| `/products` | **Products Catalog** | [http://localhost:3000/products](http://localhost:3000/products) | Live search, category tabs (*Wall Hangings*, *Hair Bows*, *Dreamcatchers*), price/recency sorting |
| `/products/[id]` | **Product Detail** | [http://localhost:3000/products/prod_calendar_hoop](http://localhost:3000/products/prod_calendar_hoop) | Multi-image gallery, customization note input, stock indicator, quantity picker, add-to-bag |
| `/gallery` | **Artisan Showcase** | [http://localhost:3000/gallery](http://localhost:3000/gallery) | Masonry grid with interactive fullscreen Lightbox (`Left`, `Right`, `Esc` navigation) |
| `/cart` | **Shopping Bag** | [http://localhost:3000/cart](http://localhost:3000/cart) | Persistent cart review, quantity adjustment (+/-), item removal, subtotal calculation |
| `/checkout` | **Checkout** | [http://localhost:3000/checkout](http://localhost:3000/checkout) | Validated form (10-digit mobile, 6-digit PIN), Cash on Delivery (COD) & UPI placeholder |
| `/order-success` | **Order Confirmation** | [http://localhost:3000/order-success](http://localhost:3000/order-success) | Generated Order ID (`KC-XXXXXX`), confetti burst, order summary, 4-step order journey |
| `/about` | **Brand Heritage** | [http://localhost:3000/about](http://localhost:3000/about) | Artisan story from Ahmedabad, handmade values, materials, craftsmanship promise |
| `/contact` | **Contact & Commissions** | [http://localhost:3000/contact](http://localhost:3000/contact) | Studio address, phone, email, WhatsApp, and custom commission inquiry form |

---

## 🛡️ Admin Management Routes

| Route | Section | Description |
|---|---|---|
| `/admin` | **Admin Redirect** | [http://localhost:3000/admin](http://localhost:3000/admin) (redirects to dashboard) |
| `/admin/login` | **Admin Login** | [http://localhost:3000/admin/login](http://localhost:3000/admin/login) |
| `/admin/dashboard` | **Analytics Dashboard** | [http://localhost:3000/admin/dashboard](http://localhost:3000/admin/dashboard) (KPIs, Monthly Revenue, Donut Status Chart, Traffic Area Chart, Daily Orders Line Chart, Recent Orders Table) |
| `/admin/products` | **Products Manager** | [http://localhost:3000/admin/products](http://localhost:3000/admin/products) (Add product modal, Edit product modal, Delete with confirmation, Stock manager) |
| `/admin/orders` | **Orders Manager** | [http://localhost:3000/admin/orders](http://localhost:3000/admin/orders) (Filter by status, search by customer/phone/ID, instant status updater dropdown, order detail modal) |
| `/admin/visitors` | **Traffic Insights** | [http://localhost:3000/admin/visitors](http://localhost:3000/admin/visitors) (Total impressions, device breakdown, top visited pages) |

---

## ⚙️ Backend REST API Endpoints

| HTTP Method | API Route | Description | Auth Required? |
|---|---|---|---|
| `POST` | `/api/auth/login` | Authenticate admin, returns JWT session cookie | Public |
| `POST` | `/api/auth/logout` | Clears admin authentication cookie | Public |
| `GET` | `/api/auth/me` | Verifies current logged-in admin session | Cookie |
| `GET` | `/api/products` | Returns all products (supports `?category=`, `?q=`, `?featured=`) | Public |
| `POST` | `/api/products` | Creates a new product with image presets | Admin Cookie |
| `GET` | `/api/products/[id]` | Retrieves single product details | Public |
| `PUT` | `/api/products/[id]` | Updates existing product details/stock | Admin Cookie |
| `DELETE` | `/api/products/[id]` | Deletes a product from database | Admin Cookie |
| `GET` | `/api/orders` | Returns list of all orders (supports `?status=`) | Admin Cookie |
| `POST` | `/api/orders` | Submits new customer order from checkout (validates inputs) | Public |
| `GET` | `/api/orders/[id]` | Retrieves single order details | Public / Admin |
| `PATCH` | `/api/orders/[id]` | Updates order status (`Pending`, `Confirmed`, `Packed`, etc.) | Admin Cookie |
| `GET` | `/api/analytics` | Aggregates KPIs, monthly revenues, order statuses, visitor traffic | Admin Cookie |
| `POST` | `/api/track` | Records client page impressions & device hardware | Public |

---

## 🏷️ Brand & Studio Information

| Attribute | Details |
|---|---|
| **Brand Name** | Kansara Creation |
| **Specialty** | Handmade Embroidery Hoop Wall Hangings, Embroidered Hair Bows, Macrame Dreamcatchers |
| **Instagram** | [https://www.instagram.com/kansara_creation/](https://www.instagram.com/kansara_creation/) |
| **Handle** | `@kansara_creation` |
| **Support Phone** | `+91 98765 43210` |
| **Support Email** | `hello@kansaracreation.com` |
| **Workshop Address** | `123, Craft Street, Ahmedabad, Gujarat 380001, India` |
| **Operating Hours** | Monday – Saturday: 10:00 AM – 7:00 PM IST |

---

## 🛠️ Environment Variables (`.env`)

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="kansara_craft_secure_jwt_secret_key_2026_xyz"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 💻 CLI Commands

```bash
# 1. Install all dependencies
npm install

# 2. Seed database (12 products, 18 orders, 900+ visits, 1 admin)
npm run seed

# 3. Start local development server
npm run dev

# 4. Run automated test suite (16 tests)
npm test

# 5. Production build check
npm run build
```
