# FurniDeliver — Inventory Management Module

## Current State
The app is a delivery management system with:
- Backend: Motoko actor with Delivery CRUD (createDelivery, getDeliveries, updateDelivery, deleteDelivery)
- Frontend: Dashboard, DeliveryList, DeliveryForm pages; sidebar + mobile bottom nav with 3 items

## Requested Changes (Diff)

### Add
- **Product** type: id, name, code (unique), category, costPrice, sellingPrice, lowStockThreshold (default 5)
- **IncomingStock** type: id, productId, productName, quantity, supplierName, expectedDate, status ("Ordered"|"Received")
- **OutgoingStock** (sale) type: id, productId, productName, quantity, customerName, date
- Backend functions: createProduct, getProducts, updateProduct, deleteProduct
- Backend functions: addIncomingStock, getIncomingStock, updateIncomingStockStatus
- Backend functions: recordSale, getSales
- Backend computed: getInventorySummary (per product: currentStock = sum of received incoming - sum of outgoing, incomingPending, soldQty)
- **Inventory section** in navigation ("Inventory" group or a new nav item expanding to sub-pages)
- **InventoryDashboard page**: 4 cards (Total Items in Stock, Low Stock Alerts count, Incoming Stock count, Sold Items count) + low stock alert list
- **ProductManagement page**: table of products with Add/Edit/Delete; form with name, code, category, costPrice, sellingPrice, lowStockThreshold
- **IncomingStock page**: table of incoming stock entries; form to add new entry; button to mark as Received (auto-adds to stock)
- **OutgoingStock (Sales) page**: table of sales; form to record a sale (product, qty, customer, date); auto-reduces stock
- **InventoryTable page**: full inventory view with columns (Product Name, Code, Current Stock, Incoming Pending, Sold Qty, Status); filters by category and stock status
- Stock status derived: Out of Stock (qty=0), Low Stock (qty>0 and qty<=threshold), In Stock (qty>threshold)
- Sample products pre-loaded (Sofa, Bed, Table, Chair variants)

### Modify
- App.tsx: add Inventory nav item (with sub-views: inventory-dashboard, products, incoming, outgoing, inventory-table)
- Sidebar and mobile nav: add Inventory section
- Existing delivery Dashboard: keep as-is

### Remove
- Nothing removed

## Implementation Plan
1. Update Motoko backend with Product, IncomingStock, OutgoingStock types and all CRUD/query functions
2. Re-generate backend bindings (backend.d.ts)
3. Add inventory types file (src/frontend/src/types/inventory.ts) with sample data
4. Add useQueries hooks for inventory (useGetProducts, useCreateProduct, etc.)
5. Build 5 new pages: InventoryDashboard, ProductManagement, IncomingStockPage, OutgoingSalesPage, InventoryTablePage
6. Update App.tsx to add inventory navigation and route to new pages
7. Keep all existing delivery functionality intact
