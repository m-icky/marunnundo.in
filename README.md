# മരുന്നുണ്ടോ.in — Kerala's Premier Pharmacy Discovery Platform 🏥

**മരുന്നുണ്ടോ.in (Marunnundo.in)** is a beautiful, modern, and highly interactive web application designed to connect patients in Kerala with nearby physical pharmacies. Users can search for specific medicines, check real-time stock availability, read trusted pharmacy reviews, and map direct routes to verified pharmacies.

---

## 🌟 Key Features

### 🔍 For Patients & Searchers
* **Interactive Live Map**: Displays nearby verified pharmacies instantly with dynamic distance calculations (in KM) from the user's coordinate center.
* **Intelligent Discovery**: Search by **medicine brand name**, **generic name**, or **pharmacy shop type** across Kerala (preset warp zones for Ernakulam, Trivandrum, Kozhikode, and Thrissur).
* **Availability Verification**: Instant visibility of whether a pharmacy has a medicine in stock, price details, and whether a physical doctor's prescription is required (`prescriptionRequired`).
* **Operational Status Indicators**: Shows whether stores are open or closed in real-time based on verified operating hours or 24/7 emergency support tags.

### 🏪 For Pharmacy Owners
* **Dedicated Dashboard**: Register shops, edit logo and banners, set operating hours for each day of the week, and configure home delivery radiuses.
* **Inventory Management**: Add, update, and manage medicine inventories (generic classifications, pricing, quantities, and prescription requirements).
* **Customer Interaction**: Read and reply to patient reviews directly.

### 🛡️ For Super Administrators
* **Verification Pipeline**: Review submitted pharmacy credentials, verify drug licenses against official state databases, and approve (`isVerified`) or suspend (`isSuspended`) pharmacy portals.

---

## 🎨 Tech Stack & Visual Design System

* **Framework**: [Next.js](https://nextjs.org/) (App Router & high-performance Server Actions)
* **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with a custom modern theme (Emerald primary tones, medical blue accents, and radial ambient backdrop gradients)
* **Components**: Responsive, rich visual layouts featuring smooth hover transitions and custom **Glassmorphism (`glass-card`) containers**
* **Database & ORM**: PostgreSQL database connected via [Prisma ORM](https://www.prisma.io/)
* **Mapping Engine**: [Leaflet.js](https://leafletjs.com/) and OpenStreetMap (custom popups, zoom adjustments, and path links)
* **Icons**: [Lucide React](https://lucide.dev/)

---

## 🛠️ Local Development Setup

To run the application locally, follow these simple setup steps:

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) (v18+) and a local [PostgreSQL](https://www.postgresql.org/) server installed and running.

### 2. Clone and Install Dependencies
```bash
git clone https://github.com/m-icky/marunnundo.in.git
cd marunnundo.in
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root of the project and set up your connection string and security keys:
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/marunnundo?schema=public"
JWT_SECRET="YOUR_SECURE_JWT_SECRET_KEY"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Push Schema & Seed the Database
Run the Prisma migrations to create database tables and seed the database with demo pharmacies, medicines, reviews, and test users:
```bash
# Push database schema tables
npx prisma db push

# Seed demo data
node prisma/seed.js
```

### 5. Launch the Application
```bash
# Start development server
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser to view the application.

---

## 🔑 Default Test Credentials

The database seed script (`prisma/seed.js`) automatically populates the following accounts for development testing:

| Role | Email | Password | Purpose |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@marunnundo.in` | `adminpassword` | Verifying drug licenses, approving/suspending shops |
| **Pharmacy Owner 1** | `owner1@gmail.com` | `owner123` | Managing Kakkanad, Palayam & MG Road pharmacy portals |
| **Pharmacy Owner 2** | `owner2@gmail.com` | `owner123` | Managing Thrissur & Kozhikode pharmacy portals |
| **Patient / User 1** | `naveen@gmail.com` | `user123` | Testing searches, booking navigation routes, submitting reviews |
| **Patient / User 2** | `ananya@gmail.com` | `user123` | Testing searches, booking navigation routes, submitting reviews |

---

## 🗄️ Managing the Database (Prisma Studio)

You can manage your local database tables visually using **Prisma Studio**:
```bash
npx prisma studio
```
This launches a graphical browser interface on **[http://localhost:5555](http://localhost:5555)** where you can search, edit, create, or delete records from any DB table.

---

## 🚀 Production Deployment Plan

This Next.js application is designed for serverless, cost-free hosting:

1. **Vercel (Hobby Tier)**: Serves the entire Next.js frontend and compiles the backend Server Actions into serverless functions.
2. **Neon.tech or Supabase (Free Tier)**: Generous hosted serverless PostgreSQL database to manage inventory, reviews, and licenses.
3. **Environment Settings**: Set up `DATABASE_URL`, `JWT_SECRET`, and `NEXT_PUBLIC_APP_URL` as environment variables on Vercel's settings dashboard.

For a detailed post-install deployment checklist, read the walkthrough in **`deployment_guide.md`**.

---

## ⚖️ Legal and Policy Directory
For legal compliance and user transparency, the following pages have been implemented:
* **[Privacy Policy](/privacy)**: Details geolocative tracking for patients and license storage for pharmacy owners.
* **[Terms of Service](/terms)**: Explains our service as a pharmacy discovery engine disclaimer (not a direct pharmaceutical vendor).
* **[Pharmacy License Policy](/pharmacy-license-policy)**: Outlines compliance rules under the Drugs and Cosmetics Act, 1940.

---

Designed & Developed by **[Mack's.Studio](https://macks.studio)**.
