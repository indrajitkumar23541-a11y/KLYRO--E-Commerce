# 💎 KLYRO | Premium Online Marketplace

![KLYRO Branding](https://img.shields.io/badge/UX/UI-High--Fidelity-blueviolet?style=for-the-badge)
![Status](https://img.shields.io/badge/Platform-Production--Ready-success?style=for-the-badge)

**KLYRO** is a world-class, premium multi-category e-commerce platform designed with a cinematic visual language and sophisticated user interactions. Built for excellence, KLYRO bridges the gap between luxury aesthetics and high-performance functionality.

---

## ✨ Cinematic Digital Experience

KLYRO isn't just a store; it's a digital destination. Our design philosophy prioritizes high-fidelity visuals and fluid interactivity:

*   **Premium Mobile Navigation**: A completely redesigned mobile drawer and bottom navigation bar featuring glassmorphism and depth graphics.
*   **Dynamic Theme Engine**: Seamless real-time switching between a sleek **Dark Hub** and a pristine **Light Interface**.
*   **High-End Categories**: Dedicated cinematic hubs for **Automotive**, **Fashion**, **Electronics**, **Beauty & Health**, and more.
*   **Admin Command Center**: A professional super-admin dashboard with real-time data visualization via Recharts.

---

## 🛠️ Technology Stack

### **Frontend Architecture**
- **React 18** & **Vite**: Ultra-fast development and optimized production builds.
- **Tailwind CSS**: Custom-configured for class-based Dark Mode and premium glassmorphism.
- **Lucide Icons**: High-fidelity iconography for a professional aesthetic.
- **Recharts**: Sophisticated data visualization for administrative insights.

### **Backend Infrastructure**
- **Node.js** & **Express**: Robust and scalable API services.
- **JWT & Bcrypt**: Enterprise-grade security for user authentication.
- **MySQL (mysql2)**: Reliable relational data management with optimized query structures.

---

## 🔌 Getting Started

### **Prerequisites**
- **Node.js**: v18 or higher.
- **MySQL**: Running instance for the database hub.

### **1. Core Configuration**
1. Clone the repository into your secure workspace.
2. **Database Hub**: Import `backend/schema.sql` into your MySQL server.
3. **Environment**: Configure `backend/.env` with your secure database credentials.

### **2. Launch Sequence**

**Backend Hub:**
```bash
cd backend
npm install
npm run dev
```

**Frontend Interface:**
```bash
cd frontend
npm install
npm run dev
```

---

## 📱 Cross-Device Optimization

KLYRO is engineered for high-performance mobile access. To view the marketplace on your mobile device during development:

1. Connect your computer and mobile device to the same Wi-Fi network.
2. Launch the frontend with network exposure:
   ```bash
   npm run dev
   ```
   *(Our custom configuration automatically handles the `--host` exposure).*
3. Access via your computer's local IP (e.g., `http://172.16.4.218:5173`).

---

## 🏗️ Project Structure

KLYRO is architected as a decoupled full-stack application, ensuring scalability and separation of concerns.

### 📂 Repository Breakdown

| Module | Technical Role | Key Technologies |
| :--- | :--- | :--- |
| **`frontend/`** | Visual Interface & UX | React, Vite, Tailwind CSS, Recharts |
| **`backend/`** | API Services & Business Logic | Node.js, Express, MySQL, JWT |
| **`database/`** | Data Persistence | relational schema (`schema.sql`) |

---

### 💻 Frontend Architecture (`/frontend/src`)

The frontend prioritizes modularity and high-fidelity design:
*   **`pages/`**: Cinematic hubs for categories like Automotive, Fashion, and the Admin Dashboard.
*   **`components/`**: Reusable UI elements including Glassmorphism cards and dynamic Navbars.
*   **`context/`**: Global state management for Authentication, Cart, and Real-time Theme switching.
*   **`api/`**: Centralized axios service layer for backend communication.
*   **`index.css`**: Core design system with custom Tailwind/CSS variables.

---

### ⚙️ Backend Architecture (`/backend`)

The backend follows a robust MVC-inspired pattern:
*   **`controllers/`**: Logic handlers for authentication, products, and administrative actions.
*   **`routes/`**: API endpoint definitions following RESTful principles.
*   **`middleware/`**: Security layers including JWT verification and request validation.
*   **`config/`**: Secure database connections and environment management.
*   **`seed_sample.js`**: Automation scripts for populating the marketplace with high-quality data.

---

<div align="center">
  <p><b>KLYRO • BUILT FOR EXCELLENCE • v4.5.0</b></p>
  <img src="https://img.shields.io/badge/Powered%20By-Antigravity-blue?style=flat-square" alt="Powered By Antigravity">
</div>
