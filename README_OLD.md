# Enterprise Inventory Tracker

A comprehensive, professional-grade inventory management system with real-time analytics, visual product management, and advanced features designed for businesses selling on Etsy and beyond.

## ✨ Features

### 📦 Core Inventory Management
- ✅ **Product Management** - Add, Edit, Delete with full CRUD operations
- ✅ **Stock Movement Tracking** - Record IN/OUT transactions with notes and dates
- ✅ **Product Images** - Upload files from your computer OR enter image URLs
  - **File Picker** - Click "Choose File" button to select images from your system
  - **Automatic Conversion** - Uploaded files converted to base64 for local storage
  - **File Validation** - Max 5MB, images only
  - **Live Preview** - See your image before saving
  - **Expandable View** - Click any product image to see full details with large 264x264px image
- ✅ **Real-time Analytics Dashboard** - KPIs, charts, and business insights
- ✅ **Low Stock Alerts** - Automatic alerts for products below reorder point
- ✅ **Category Organization** - Organize products by custom categories

### 🔒 Data Safety & Backup
- ✅ **IndexedDB Storage** - Enterprise-grade local database supporting millions of products
- ✅ **Automatic Migration** - Seamlessly migrates from localStorage on first load
- ✅ **Auto-Backup Reminders** - Smart reminders after 3 days (new users) or 7 days (existing users)
- ✅ **Data Loss Warning Banner** - Visual alerts when backups are overdue
- ✅ **JSON Backup & Restore** - Complete data export/import functionality
- ✅ **Undo Functionality** - Revert recent changes
- ✅ **Unlimited Capacity** - Store millions of products locally (50%+ of disk space)

### 📊 Analytics & Reporting
- ✅ **Profit & Margin Calculations** - Automatic profit tracking per product
- ✅ **Tax Tracking** - Configurable tax rates per product
- ✅ **CSV Export** - Export inventory to spreadsheet format
- ✅ **Print Reports** - Print-friendly inventory reports
- ✅ **Shopping List Generator** - One-click reorder list for low-stock items
- ✅ **Multi-Currency Support** - 10 currencies (USD, EUR, GBP, CAD, AUD, JPY, CNY, INR, MXN, BRL)

### 🎯 Professional Features
- ✅ **Interactive Tutorial** - 6-step guided onboarding for new users
- ✅ **Help System** - Always-accessible tutorial via help button
- ✅ **Demo Mode** - Explore with sample data before committing
- ✅ **Dark Theme UI** - Modern, professional gradient design
- ✅ **Bulk Operations** - Fast bulk add/update/delete for large inventories

## 💾 Data Storage

This application uses **IndexedDB** for local data storage, providing:

- **Massive Capacity**: Store up to 50% of available disk space (100s of GBs)
- **Performance**: Indexed queries for instant search across millions of products
- **Reliability**: Transaction-based storage prevents data corruption
- **100% Local**: All data stays on your computer - no internet required
- **Migration**: Automatically migrates existing localStorage data on first launch

### Storage Limits

| Storage Type | Max Capacity | Products Supported |
|--------------|--------------|-------------------|
| localStorage (old) | 5-10 MB | ~100-200 products |
| **IndexedDB (current)** | **50% of disk** | **Millions of products** |

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

The app will open at `http://localhost:5173`

### 3. Build for Production

```bash
npm run build
```

## 📖 Usage Guide

### First-Time Setup
- **Interactive Tutorial** automatically launches for new users
- **Demo Mode** provides sample data to explore features
- Click **Help button (?)** in header to restart tutorial anytime

### Adding Products
1. Click **"Add Product"** button
2. Fill in required fields (SKU*, Name*)
3. **Add Product Image** (choose one method):
   - **Method 1:** Click **"Choose File"** button to upload from your computer (max 5MB)
   - **Method 2:** Paste an image URL in the text field
4. See live preview of your image before saving
5. Set pricing, stock levels, and supplier info
6. Click **"Add Product"** to save

### Recording Stock Movements
1. Click **"Movement"** button
2. Select product from dropdown
3. Choose **Stock In (Add)** or **Stock Out (Remove)**
4. Enter quantity and optional notes
5. Click **"Record Movement"** - inventory updates automatically!

### Viewing Product Details
- **Thumbnail View:** All products show 48x48px images in the table
- **Expanded View:** Click any product image to expand the row
- **Large Image Display:** Expanded view shows 264x264px product image
- **Complete Details:** See SKU, supplier, location, stock levels, and notes
- **Click Again:** Click the image again to collapse the row

### Product Images
- **Upload Files:** Click "Choose File" to select images from your system
- **Or Use URLs:** Paste any publicly accessible image URL
- **File Limits:** Images must be under 5MB, image formats only
- **Preview:** See live preview below the input before saving
- **Storage:** Uploaded files converted to base64 and stored locally

### QR Codes & Barcodes
- Click the **purple QR code icon** next to any product
- Modal displays scannable QR code with product info
- Click **"Print Label"** to print barcode labels
- QR codes encode SKU, name, and product ID

### Data Backup & Safety
- **Automatic reminders** prompt you to backup regularly
- **Warning banner** appears if backup is >7 days old
- Go to **Settings → "Backup All Data (JSON)"**
- Save the file to cloud storage (Google Drive, Dropbox, etc.)
- **Restore** anytime via Settings → "Restore from Backup"

### Exporting Data
- **CSV Export:** Click "Export CSV" in Products tab for spreadsheet-compatible format
- **JSON Backup:** Settings → "Backup All Data" for complete data preservation
- **Shopping List:** Click "Reorder" button to download text file of items to reorder
- **Print Reports:** Click "Print Report" for physical inventory documentation

## 🎨 Demo Data

The system includes 8 sample products with images across 3 categories:

**Electronics:**
- Wireless Mouse (45 units, $12.50 → $24.99)
- USB-C Cable (8 units - LOW STOCK, $3.25 → $9.99)
- Bluetooth Speaker (22 units, $28.00 → $59.99)

**Clothing:**
- Cotton T-Shirt (OUT OF STOCK, $8.50 → $19.99)
- Denim Jeans (15 units, $22.00 → $49.99)

**Home & Kitchen:**
- Ceramic Mug (67 units, $4.75 → $12.99)
- Cutting Board (5 units - LOW STOCK, $15.00 → $34.99)
- Glass Storage Set (31 units, $18.50 → $39.99)

## 💾 Data Storage

All data is stored locally in your browser's `localStorage`:
- **Advantages:** No server costs, instant access, complete privacy
- **Important:** Data is device-specific - clear browser cache = data loss!
- **Solution:** Use regular backups to external storage

## 🔧 Technical Stack

- **React 18.2.0** - Modern UI framework
- **Vite 5.0.0** - Lightning-fast build tool
- **Tailwind CSS 3.3.0** - Utility-first styling
- **Recharts 2.10.0** - Beautiful analytics charts
- **Lucide React 0.294.0** - Professional icon library
- **QRCode.React** - QR code generation

## 🎯 Perfect For

- Etsy sellers managing inventory
- Small business owners
- Crafters and makers
- Home-based businesses
- Anyone needing simple, visual inventory tracking

## 📝 License

This is a digital product designed for sale on Etsy.

## 🆘 Support

For questions or issues:
1. Click the **Help button (?)** in the header for tutorial
2. Check this README for usage guidelines
3. Verify you've backed up your data recently

## 🚀 Future Enhancements

Planned features for future versions:
- Batch CSV import
- Mobile-responsive design
- Sales tracking module
- Cloud synchronization
- Multi-user access
- Barcode scanning

---

**Made with ❤️ for small business owners**### QR Codes & Barcodes
- Click the **purple QR code icon** next to any product
- Modal displays scannable QR code with product info
- Click **"Print Label"** to print barcode labels
- QR codes encode SKU, name, and product ID

### Data Backup & Safety
- **Automatic reminders** prompt you to backup regularly
- **Warning banner** appears if backup is >7 days old
- Go to **Settings → "Backup All Data (JSON)"**
- Save the file to cloud storage (Google Drive, Dropbox, etc.)
- **Restore** anytime via Settings → "Restore from Backup"
2. Fill in required fields (SKU, Name)
3. Set pricing, stock levels, and supplier info
4. Click "Add Product"

### Recording Movements
1. Click "Movement" button
2. Select product
3. Choose Stock In or Stock Out
4. Enter quantity and notes
5. Click "Record Movement"

### Exporting Data
- **CSV**: Click "Export CSV" in Products tab
- **JSON Backup**: Go to Settings → "Backup All Data"

### Importing Data
- Go to Settings → "Restore from Backup"
- Select your JSON backup file

## Data Storage

All data is stored locally in your browser's localStorage. No server required!

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- Recharts (for analytics)
- Lucide React (icons)

## License

MIT
