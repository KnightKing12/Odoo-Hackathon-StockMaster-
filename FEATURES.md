# StockMaster Features Overview

## Implemented Features
- **Authentication**: Demo login with placeholder credentials (admin@stockmaster.com / password).
- **Dashboard**:
  - KPI cards with gradient design.
  - Internal Transfers Scheduled KPI.
- **Product Management**:
  - Add/Edit products with Name, SKU, Category, Unit of Measure.
  - Reordering rules (`reorderPoint`).
  - Minimum stock level tracking.
- **Warehouse Management**:
  - Add Warehouse modal.
  - Per‑warehouse stock tracking displayed in product list.
- **Operations**:
  - Receipts, Deliveries, Transfers, Adjustments.
  - Move History (Ledger) view with sortable list.
  - Advanced filters for Move History (type, search).
- **UI/UX**:
  - Premium glassmorphism, gradients, animations.
  - Responsive design with Tailwind CSS.

## Missing / Partially Implemented Features
- **Authentication**: OTP‑based password reset not implemented.
- **Dashboard**: KPIs for Total Products, Low Stock/Out of Stock, Pending Receipts, Pending Deliveries are not present.
- **Dynamic Filters**: Full filter set for Operations (by document type and status) is not implemented.
- **Profile Menu / Settings**: Sidebar profile options (My Profile, Logout) are not present.
- **Multi‑warehouse support**: Basic per‑warehouse stock tracking exists, but advanced location‑based filters and SKU search are not fully implemented.
- **Alerts**: Low‑stock alerts are shown, but customizable alert thresholds are not.

## Next Steps
- Implement OTP password reset flow.
- Add missing dashboard KPIs.
- Extend filter functionality to Operations view.
- Add profile menu with logout capability.
- Enhance warehouse/location filtering and SKU search.
- Refine alert system for low stock.
