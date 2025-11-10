# Etsy Inventory Tracker - User Manual

**Version 1.0.0**

---

## 📖 Table of Contents

1. [Getting Started](#getting-started)
2. [Dashboard Overview](#dashboard-overview)
3. [Adding Products](#adding-products)
4. [Managing Products](#managing-products)
5. [Stock Movements](#stock-movements)
6. [Analytics](#analytics)
7. [Import/Export](#importexport)
8. [Troubleshooting](#troubleshooting)

---

## 🚀 Getting Started

### First Launch

When you first open Etsy Inventory Tracker, you'll see:
- An empty product list
- A welcome dashboard
- Zero inventory value

**Don't worry!** Let's add your first product.

### Quick Start (5 minutes)

1. Click the **"Add Product"** button (top right)
2. Fill in product details (name, SKU, price)
3. Click **"Save"**
4. See your product appear in the list!

That's it! You're tracking inventory.

---

## 📊 Dashboard Overview

The main dashboard shows:

### 📈 Key Metrics (Top Cards)
- **Total Products**: Count of all products in inventory
- **Total Value**: Sum of (quantity × cost price) for all products
- **Low Stock Items**: Products below minimum quantity threshold
- **Out of Stock**: Products with zero quantity

### 📉 Analytics Charts
- **Inventory Value Trend**: How your inventory value changes over time
- **Category Distribution**: Pie chart showing products by category
- **Stock Level Overview**: Bar chart of product quantities

### 🔍 Quick Actions
- **Add Product**: Add new inventory item
- **Import CSV**: Bulk upload products
- **Export Data**: Download all data as CSV
- **Search**: Filter products by name, SKU, or category

---

## ➕ Adding Products

### Method 1: Manual Entry (Individual Products)

1. Click **"Add Product"** button
2. Fill in the form:
   - **Name**: Product name (e.g., "Cotton T-Shirt - Blue")
   - **SKU**: Unique identifier (e.g., "SHIRT-BLU-001")
   - **Category**: Product type (e.g., "Clothing")
   - **Quantity**: Current stock level (e.g., 50)
   - **Cost Price**: What you paid (e.g., $5.00)
   - **Selling Price**: What you sell for (e.g., $19.99)
   - **Min Quantity**: Low stock alert threshold (e.g., 10)
   - **Description**: Optional notes

3. Click **"Save Product"**

**Pro Tip**: The profit margin calculates automatically!

### Method 2: CSV Import (Bulk Upload)

Perfect for adding many products at once.

1. Click **"Import CSV"** button
2. Download the template (or create your own)
3. Fill in your products:
   ```
   Name,SKU,Category,Quantity,Cost Price,Selling Price,Min Quantity,Description
   Blue T-Shirt,SKU-001,Clothing,50,5.00,19.99,10,100% cotton
   Red Mug,SKU-002,Drinkware,30,3.50,12.99,5,Ceramic 12oz
   ```
4. Upload your CSV file
5. Review products (preview shown)
6. Click **"Confirm Import"**

**CSV Format Requirements:**
- First row must be headers (exact names above)
- Prices without currency symbols ($5.00 → 5.00)
- Quantities as whole numbers
- SKU must be unique for each product

---

## 🔧 Managing Products

### Edit Product

1. Find your product in the list
2. Click the **"Edit"** button (pencil icon)
3. Update any field
4. Click **"Save Changes"**

### Delete Product

1. Find your product
2. Click **"Delete"** button (trash icon)
3. Confirm deletion

**Warning**: Deleting a product also removes its stock movement history!

### Search & Filter

**Search Bar**: Type name, SKU, or category
- Updates results as you type
- Case-insensitive
- Searches all fields

**Quick Filters** (buttons above table):
- **All**: Show all products
- **Low Stock**: Products below minimum quantity
- **Out of Stock**: Products with zero quantity

### Sort Products

Click any column header to sort:
- **Name**: Alphabetical (A→Z or Z→A)
- **Quantity**: Low to high or high to low
- **Value**: Least to most valuable
- **Category**: Grouped by category

---

## 📦 Stock Movements

Track every change to inventory quantities.

### Add Stock (Receiving Inventory)

1. Click **"Adjust Stock"** for a product
2. Select **"Add Stock"**
3. Enter quantity to add (e.g., 20)
4. Add a note (e.g., "Received shipment from supplier")
5. Click **"Save"**

**Result**: Quantity increases, movement recorded

### Remove Stock (Selling/Using Inventory)

1. Click **"Adjust Stock"**
2. Select **"Remove Stock"**
3. Enter quantity to remove (e.g., 5)
4. Add a note (e.g., "Sold on Etsy order #12345")
5. Click **"Save"**

**Result**: Quantity decreases, movement recorded

### Set Exact Stock (Inventory Count)

Use this when doing physical inventory counts.

1. Click **"Adjust Stock"**
2. Select **"Set Exact Quantity"**
3. Enter actual counted quantity
4. Add note (e.g., "Physical inventory count - March 2024")
5. Click **"Save"**

**Result**: Quantity set to exact number, difference recorded

### View Movement History

1. Click on any product
2. View **"Stock Movements"** section
3. See all historical changes:
   - Date & time
   - Type (add/remove/set)
   - Quantity changed
   - Note/reason
   - New balance after change

**Pro Tip**: Use notes to track why stock changed. Great for audits!

---

## 📈 Analytics

### Inventory Valuation

See total value of all inventory:
- **Formula**: Sum of (Quantity × Cost Price) for all products
- **Updates**: Real-time as you add/remove stock
- **Use Case**: Know how much money is tied up in inventory

### Low Stock Alerts

Automatically highlights products running low:
- **Threshold**: Set "Min Quantity" for each product
- **Alert**: Red badge when quantity drops below minimum
- **Filter**: Click "Low Stock" to see only these products

### Category Analysis

Pie chart showing distribution:
- **View**: See which categories dominate inventory
- **Click**: Segments to filter by category
- **Use Case**: Identify which product lines to expand

### Stock Level Overview

Bar chart of quantities:
- **View**: Visual comparison of stock levels
- **Identify**: Products with too much or too little stock
- **Use Case**: Reorder decisions

---

## 💾 Import/Export

### Export All Data (Backup)

**Why**: Backup your data or move to another computer

1. Click **"Export Data"** button
2. Choose format:
   - **CSV**: Open in Excel/Google Sheets
   - **JSON**: Complete backup with settings
3. File downloads automatically
4. Save somewhere safe!

**What's Exported**:
- All products with full details
- All stock movements
- All settings
- Database structure

**When to Export**:
- Weekly backups
- Before major changes
- When switching computers
- Before updates

### Import Data (Restore)

**Why**: Restore from backup or add bulk products

1. Click **"Import Data"** button
2. Select your file (CSV or JSON)
3. Preview what will be imported
4. Click **"Confirm Import"**

**CSV Import**:
- Adds new products only
- Won't overwrite existing products
- SKU must be unique

**JSON Import**:
- Restores complete database
- Overwrites existing data
- Use for full backups

### Transfer to Another Computer

1. On old computer: **Export Data** (JSON format)
2. Save the .json file to USB drive or cloud storage
3. Install app on new computer
4. On new computer: **Import Data**
5. Select the .json file
6. All products and history transferred!

---

## 🔧 Troubleshooting

### App Won't Open

**Windows**:
- Right-click .exe → "Run as administrator"
- Check Windows Defender didn't block it
- Disable antivirus temporarily during install

**Mac**:
- Right-click app → "Open" (don't double-click first time)
- System Preferences → Security → "Open Anyway"
- Allow in Gatekeeper

**Linux**:
- Right-click .AppImage → Properties → Permissions → "Allow executing as program"
- Install FUSE: `sudo apt install libfuse2`

### Data Not Saving

**Check**:
1. Do you have disk space? (Need 500MB free)
2. Try Export/Import to rebuild database
3. Check browser console for errors (if running in dev mode)

**Fix**:
1. Export your data (backup!)
2. Close app completely
3. Reopen app
4. Import data back

### Import Failed

**Common Issues**:
- **Wrong CSV format**: Use the template!
- **Duplicate SKUs**: Each SKU must be unique
- **Invalid prices**: Numbers only, no $ or £ symbols
- **Encoding**: Save CSV as UTF-8

**Fix**:
1. Open CSV in Excel/Google Sheets
2. Check headers match exactly: Name,SKU,Category,Quantity,Cost Price,Selling Price,Min Quantity,Description
3. Remove special characters from prices
4. Ensure SKUs are unique
5. Save and try again

### Products Not Showing

**Check Filters**:
1. Clear search bar (should be empty)
2. Click "All" filter button
3. Check if accidentally filtered by "Low Stock" or "Out of Stock"

### Export Not Working

**Browser Issues** (if running in browser):
- Allow pop-ups for this site
- Check Downloads folder
- Try different browser

**App Issues**:
- Check you have write permissions
- Try exporting to Desktop instead
- Make sure disk isn't full

---

## 🎓 Best Practices

### SKU Naming

Create consistent SKU patterns:
```
CATEGORY-COLOR-SIZE-NUMBER
SHIRT-BLU-M-001
SHIRT-RED-L-002
MUG-WHT-12OZ-001
```

### Regular Backups

**Weekly**: Export to JSON
**Monthly**: Save to cloud storage (Google Drive, Dropbox)
**Before updates**: Always export first!

### Stock Counts

Physical inventory counts monthly:
1. Count actual stock
2. Use "Set Exact Quantity" for each product
3. Add note: "Physical count - [DATE]"
4. Investigate discrepancies

### Category Organization

Group similar products:
- ✅ "Clothing - Shirts"
- ✅ "Clothing - Pants"
- ✅ "Drinkware - Mugs"
- ✅ "Drinkware - Bottles"

Better than:
- ❌ "Shirts"
- ❌ "Pants"
- ❌ "Mugs"

### Min Quantity Settings

Set low stock alerts based on:
- **Lead time**: How long to reorder?
- **Sales velocity**: How many sell per week?
- **Minimum order**: Supplier minimums?

**Formula**: Min Qty = (Weekly Sales × Weeks Lead Time) + Safety Stock

Example:
- Sell 10/week
- Reorder takes 2 weeks
- Want 1 week safety stock
- Min Qty = (10 × 2) + 10 = 30

---

## 💡 Pro Tips

1. **Use Notes**: Add supplier info to product descriptions
2. **Track Costs**: Update cost price when it changes
3. **Regular Exports**: Weekly backups save headaches
4. **Stock Movements**: Always add notes (great for audits)
5. **Categories**: Use them! Makes filtering easier
6. **CSV Templates**: Save blank template for quick imports
7. **Physical Counts**: Monthly counts keep data accurate

---

## 📞 Support

Need help?

📧 **Email**: [YOUR-EMAIL]
💬 **Etsy Messages**: Message your order
⏰ **Response Time**: Within 24 hours

**Include in support requests**:
- Operating system (Windows/Mac/Linux)
- App version (found in About section)
- Screenshot of error (if applicable)
- What you were trying to do

---

## 🔄 Updates

### Checking for Updates

Currently: Manual check on Etsy shop

Future: In-app update notifications

### Installing Updates

1. Export your data (backup!)
2. Download new version
3. Install over old version
4. Open app - data should transfer automatically
5. If not, import your backup

---

## 📜 Keyboard Shortcuts

**Windows/Linux**:
- `Ctrl + N`: New product
- `Ctrl + F`: Search
- `Ctrl + S`: Save (when editing)
- `Ctrl + E`: Export data
- `Ctrl + Q`: Quit

**Mac**:
- `Cmd + N`: New product
- `Cmd + F`: Search
- `Cmd + S`: Save
- `Cmd + E`: Export data
- `Cmd + Q`: Quit

---

## 🎯 Quick Reference Card

```
ADD PRODUCT → Top-right button
EDIT PRODUCT → Pencil icon on product row
DELETE PRODUCT → Trash icon on product row
ADJUST STOCK → Stock icon on product row
SEARCH → Top search bar
FILTER → All/Low Stock/Out of Stock buttons
EXPORT → Export Data button (top)
IMPORT → Import Data button (top)
ANALYTICS → Dashboard tab
MOVEMENTS → History tab
```

---

**Happy Tracking!** 📦

Questions? Feedback? Feature requests? I'd love to hear from you!

---

*Etsy Inventory Tracker v1.0.0*  
*© 2024 All Rights Reserved*
