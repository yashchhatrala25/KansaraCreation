# 🌸 Kansara Creation — Luxury Handcrafted E-Commerce

A full-stack, production-quality e-commerce web platform built for **Kansara Creation**, a premier handmade products brand specializing in personalized anniversary calendar embroidery hoops, botanical hair bows, and bohemian macrame dreamcatchers.

> **Official Brand Instagram**: [https://www.instagram.com/kansara_creation/](https://www.instagram.com/kansara_creation/)  
> **Artisan Studio**: 123, Craft Street, Ahmedabad, Gujarat 380001  
> **Contact**: +91 98765 43210 | hello@kansaracreation.com  

---

## ✨ Features & Highlights

### 🎨 Design System (Dark + 3D + Micro-Interactions)
- **Palette**: Deep dark theme (`#0B0B12`, `#11111A`, surfaces `#1A1A26`) with luminous neon accents (Violet `#7C3AED` to Pink `#EC4899` to Amber `#F59E0B`).
- **Typography**: Playfair Display (editorial serif) paired with Inter (modern clean sans-serif).
- **Interactive 3D Hero**: Custom Three.js 3D embroidery hoop wall hanging with brass clamp, linen cloth, stitched floral knots, anniversary date circle, and responsive mouse-parallax tilting.
- **3D Card Tilt**: Product cards with real-time 3D tilt perspective matching mouse hover coordinates.
- **Accessibility & Performance**: 60fps canvas loop with automatic WebGL detection and graceful 2D animated fallback for low-power or reduced-motion environments.

### 🛍️ Customer Storefront
- **Home**: 3D interactive hero, curated category showcase, featured products, craftsmanship timeline, live Instagram community grid (`@kansara_creation`), customer reviews, and guarantees.
- **Products Catalog**: Filter by category (*Wall Hangings*, *Hair Bows*, *Dreamcatchers*), real-time search, and price/recency sorting.
- **Product Detail**: Multi-angle image gallery, stock level indicator, customization note input (for anniversary dates & couple names), quantity picker, and related product recommendations.
- **Artisan Gallery**: Masonry showcase with fullscreen interactive lightbox modal supporting keyboard navigation (`Left`, `Right`, `Esc`).
- **Persistent Cart**: LocalStorage-synced shopping cart with slide-over quick drawer and dedicated bag review page.
- **Validated Checkout**: Field validation for 10-digit Indian mobile numbers, 6-digit postal codes, and email format. Cash on Delivery (COD) enabled with UPI payment gateway placeholder.
- **Order Success**: Order confirmation with Order ID, customer contact recap, animated confetti celebration, and 4-step dispatch timeline.
- **About & Contact**: Artisan studio heritage, values, FAQ, and custom commission inquiry form.

### 🛡️ Secure Admin Portal (`/admin`)
- **Login Authentication**: Secure portal protected with bcrypt password hashing and 7-day signed JWT HTTP-only cookies.
- **Executive Analytics Dashboard**:
  - 4 Key Metric Cards: Total Orders, Pending Orders, Total Revenue (INR), and Current Month Income.
  - Interactive Recharts:
    1. Monthly Revenue Trend (6-month bar chart with gradient fill)
    2. Order Status Breakdown (Donut chart for all 6 statuses)
    3. Daily Orders Volume (Line chart)
    4. Store Traffic (14-day area chart)
    5. Top Selling Products
  - Quick Orders table with instant status selector.
- **Catalog Management (`/admin/products`)**:
  - Full CRUD: Add, edit, preview, and delete products.
  - Multiple image presets or custom image URLs.
  - Real-time stock counter and featured product toggle.
- **Order Fulfillment (`/admin/orders`)**:
  - Filter orders by status (*Pending*, *Confirmed*, *Packed*, *Shipped*, *Delivered*, *Cancelled*).
  - Search by customer name, phone, email, or order ID.
  - Immediate status update dropdown synced to the database.
  - Detailed modal view with customer shipping address, items ordered, and custom embroidery instructions.
- **Visitor Traffic Insights (`/admin/visitors`)**:
  - Automatic background visitor tracking by session and device.
  - Mobile vs. Desktop hardware breakdown.
  - Top visited pages leaderboard.

---

## 🚀 One-Command Local Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Seed Database
Seeds 12 realistic products, 18 past orders spanning 6 months, and 900+ visitor logs:
```bash
npm run seed
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Admin Credentials

| Field | Value |
|---|---|
| **Admin Login URL** | [http://localhost:3000/admin/login](http://localhost:3000/admin/login) |
| **Email** | `admin@kansara.com` |
| **Password** | `Admin@123` |

> ⚠️ **Security Tip**: Please change the default admin password in production.

---

## 🧪 Testing Suite

Run the automated unit and API test suite:
```bash
npm test
```

### Tested Modules:
- ✅ **10-Digit Indian Phone Validator**: Rejects short/alphanumeric inputs, accepts standard formats.
- ✅ **6-Digit Postal Pincode Validator**: Validates Indian PIN codes.
- ✅ **Email Regex Validator**: RFC compliant email format testing.
- ✅ **INR Currency Formatter**: Currency symbol and Indian numbering format (`₹1,899`).
- ✅ **Order Total Calculator**: Computes item prices and quantities accurately.
- ✅ **Status Badge Configuration**: Validates colors and badges for all 6 order statuses.
- ✅ **Bcrypt Security**: Hashing and password verification.
- ✅ **JWT Token Lifecycle**: Issue, sign, and verify admin sessions.
- ✅ **Database Product CRUD**: Create, read, update, and delete products.
- ✅ **Order Fulfillment Flow**: Place order as *Pending*, advance to *Confirmed*, *Packed*, *Shipped*, *Delivered*.

---

## 📦 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, React 19)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS + Custom Dark Theme Glassmorphism
- **3D Graphics**: Three.js (Procedural geometries, materials, lighting & parallax)
- **Data Visualization**: Recharts (Responsive charts)
- **Icons**: Lucide React
- **Animations & Celebrations**: Canvas Confetti & CSS 3D Transforms
- **Security & DB**: BcryptJS, JSONWebToken, SQLite / JSON Storage Engine

---

## 🏷️ Adding New Products via Admin

1. Log in at `/admin/login` using the admin credentials.
2. Navigate to **Products** in the sidebar.
3. Click **"Add New Product"**.
4. Fill in the product name, select category (*Wall Hangings*, *Hair Bows*, or *Dreamcatchers*), price in INR, available stock, and description.
5. Select a pre-configured high-res studio image or enter a custom image URL.
6. Click **"Create Product"**. It immediately appears in your live customer catalog!
