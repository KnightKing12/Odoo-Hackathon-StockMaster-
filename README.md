# 📦 StockMaster - Inventory Management System

<div align="center">

![StockMaster Logo](https://img.shields.io/badge/StockMaster-IMS-blue?style=for-the-badge&logo=package&logoColor=white)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

**A modern, feature-rich inventory management system built for the Odoo Hackathon**

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Usage](#-usage) • [Tech Stack](#-tech-stack) • [Contributing](#-contributing)

</div>

---

## 🌟 Overview

StockMaster is a comprehensive inventory management system designed to streamline warehouse operations, track stock movements, and provide real-time insights into your inventory. Built with modern web technologies and a focus on user experience, it offers a powerful yet intuitive interface for managing products, warehouses, and stock transactions.

### ✨ Key Highlights

- 🎨 **Premium UI/UX** - Glassmorphism design with smooth animations
- 📊 **Real-time Dashboard** - Interactive charts and KPI cards
- 🏢 **Multi-warehouse Support** - Track inventory across multiple locations
- 📱 **Responsive Design** - Works seamlessly on all devices
- 🔥 **Firebase Ready** - Built-in Firebase integration for real-time data sync
- 🚀 **Lightning Fast** - Powered by Vite for instant hot module replacement

---

## 🎯 Features

### 🔐 Authentication
- **Demo Login** - Quick access with pre-filled credentials
- **Firebase Auth Ready** - Seamless integration with Firebase Authentication
- **Session Management** - Secure session storage

### 📊 Dashboard
- **5 Key Performance Indicators (KPIs)**
  - 📦 Total Products
  - ⚠️ Low Stock Alerts
  - 📥 Pending Receipts
  - 📤 Pending Deliveries
  - 🔄 Internal Transfers Scheduled
- **Interactive Charts**
  - Bar Chart - Stock by Category
  - Pie Chart - Stock Distribution
- **Real-time Updates** - Data refreshes automatically

### 📦 Product Management
- **CRUD Operations** - Create, Read, Update, Delete products
- **Advanced Filtering**
  - 🔍 SKU/Name Search
  - 📂 Category Filter
  - 🏢 Warehouse Filter
- **Product Details**
  - SKU/Code
  - Category
  - Unit of Measure
  - Min Stock Level
  - Reorder Point
  - Initial Stock (on creation)
- **Stock Tracking** - Per-warehouse stock levels with breakdown

### 🏢 Warehouse Management
- **Multi-location Support** - Manage multiple warehouses
- **Warehouse Details**
  - Name
  - Location
  - Capacity indicators
  - Active zones
- **Visual Cards** - Beautiful warehouse overview cards

### 🔄 Operations Center
- **4 Transaction Types**
  - 📥 **Receipts** - Incoming stock from vendors
  - 📤 **Deliveries** - Outgoing stock to customers
  - 🔄 **Transfers** - Internal warehouse movements
  - ⚙️ **Adjustments** - Stock corrections
- **Status Tracking**
  - Draft
  - Waiting
  - Ready
  - Done
  - Canceled
- **Smart Forms** - Context-aware fields based on transaction type

### 📜 Move History / Stock Ledger
- **Complete Audit Trail** - Every stock movement recorded
- **Advanced Filters**
  - Filter by transaction type
  - Search by product name or reference
- **Detailed Information**
  - Date & Time
  - Reference Document
  - Transaction Type
  - Product
  - Warehouse
  - Quantity (with +/- indicators)
  - Status

### 👤 User Profile Management
- **Editable Profile Fields**
  - Full Name
  - Email Address
  - Phone Number
  - Gender (Male/Female/Other/Prefer not to say)
  - Street Address
  - City
  - Country
  - Role (read-only)
- **Edit/Save Functionality** - Toggle edit mode with cancel option
- **Beautiful Header** - Gradient background with user avatar
- **Session Persistence** - Profile data saved locally

---

## 🚀 Installation

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Git**

### Quick Start

```bash
# Clone the repository
git clone https://github.com/KnightKing12/Odoo-Hackathon-StockMaster-.git

# Navigate to project directory
cd Odoo-Hackathon-StockMaster-

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

---

## 💻 Usage

### Demo Login

Use these credentials to access the demo:

- **Email:** `admin@stockmaster.com`
- **Password:** `password`

### Navigation

- **Dashboard** - Overview of your inventory
- **Products** - Manage your product catalog
- **Operations** - Record stock transactions
- **Warehouses** - Manage warehouse locations
- **Move History** - View complete stock ledger
- **My Profile** - Update your profile information

### Creating a Product

1. Navigate to **Products**
2. Click **Add Product** button
3. Fill in product details:
   - Product Name
   - SKU/Code
   - Category
   - Unit of Measure
   - Min Stock Level
   - Reorder Point (optional)
   - Initial Stock (optional)
   - Initial Warehouse (if initial stock > 0)
4. Click **Save Product**

### Recording a Transaction

1. Navigate to **Operations**
2. Select transaction type (Receipt/Delivery/Transfer/Adjustment)
3. Fill in the form:
   - Product
   - Quantity
   - Warehouse (source/target for transfers)
   - Status
   - Reference Document (optional)
   - Partner name (for receipts/deliveries)
4. Click **Confirm Transaction**

---

## 🛠️ Tech Stack

### Frontend
- **React 18.3** - UI library
- **Vite 6.0** - Build tool & dev server
- **TailwindCSS v4** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Lucide React** - Icon library

### Data Visualization
- **Recharts** - Charting library for React

### Backend/Database
- **Firebase 11.1** - Backend-as-a-Service
  - Authentication
  - Firestore (NoSQL database)
  - Real-time listeners

### UI/UX Libraries
- **react-hot-toast** - Toast notifications
- **clsx** - Conditional class names
- **tailwind-merge** - Merge Tailwind classes

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

---

## 📁 Project Structure

```
StockMaster/
├── public/              # Static assets
├── src/
│   ├── StockMaster.jsx  # Main application component (1,544 lines)
│   ├── App.jsx          # App wrapper
│   ├── index.css        # Global styles & Tailwind directives
│   └── main.jsx         # Entry point
├── .gitignore
├── FEATURES.md          # Detailed feature list
├── README.md            # This file
├── package.json         # Dependencies & scripts
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind configuration
└── postcss.config.js    # PostCSS configuration
```



## 🎨 Design Philosophy

StockMaster follows modern design principles:

- **Glassmorphism** - Frosted glass effect for depth
- **Gradient Accents** - Vibrant color transitions
- **Micro-animations** - Smooth hover and transition effects
- **Dark Sidebar** - Professional contrast with light content
- **Responsive Grid** - Adapts to all screen sizes
- **Accessibility** - ARIA labels and keyboard navigation

---

## 📝 Available Scripts

```bash
# Development
npm run dev          # Start dev server with HMR

# Production
npm run build        # Build for production
npm run preview      # Preview production build

# Linting
npm run lint         # Run ESLint
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style
- Add comments for complex logic
- Test thoroughly before submitting
- Update documentation as needed

---

## 🐛 Known Issues & Roadmap

### Current Limitations
- ⏳ Firebase integration uses placeholder credentials
- ⏳ In-memory data storage (no persistence without Firebase)
- ⏳ OTP-based password reset not yet implemented

### Upcoming Features
- 🔜 Real-time data sync with Firestore
- 🔜 Email notifications for low stock
- 🔜 Barcode scanning support
- 🔜 Export reports (PDF/Excel)
- 🔜 Multi-user collaboration
- 🔜 Advanced analytics dashboard
- 🔜 Mobile app (React Native)

---

## 👥 Authors

- Bhavesh Pathak
- Shivam Patel
- Nipun Mahajan
- Shashank Gupta

---

## 🙏 Acknowledgments

- Built for the **Odoo Hackathon**
- Inspired by modern inventory management systems
- UI/UX inspiration from Dribbble and Behance
- Icons by [Lucide](https://lucide.dev/)
- Charts by [Recharts](https://recharts.org/)

---

## 📞 Support

For support, email your-pathakbhavesh2005@gmail.com or open an issue in the GitHub repository.

---

<div align="center">

**Made with ❤️ for the Odoo Hackathon**

⭐ Star this repo if you find it helpful!

[Report Bug](https://github.com/KnightKing12/Odoo-Hackathon-StockMaster-/issues) • [Request Feature](https://github.com/KnightKing12/Odoo-Hackathon-StockMaster-/issues)

</div>
