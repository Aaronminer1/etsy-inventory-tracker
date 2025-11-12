# 🏪 Etsy Inventory Tracker - Professional Edition

## Welcome to Your New Inventory Management System!

Thank you for purchasing the **Etsy Inventory Tracker**! This powerful tool helps you manage your product inventory with ease - whether you're selling on Etsy, your own website, or multiple platforms.

---

## 🎯 What This Does

✅ **Track Unlimited Products** - Manage SKUs, quantities, prices, and product details  
✅ **Automated Web Crawling** - Import products directly from your website  
✅ **Smart Image Detection** - Automatically captures product images  
✅ **Inventory Movements** - Track stock changes, sales, and restocks  
✅ **Visual Analytics** - See your inventory health at a glance  
✅ **100% Privacy** - All data stays on YOUR computer (nothing uploaded to cloud!)  
✅ **Multi-Platform** - Works on Windows, Mac, and Linux

---

## 🚀 ONE-CLICK INSTALLATION (Easiest Method)

### For Windows Users:
1. Download the installer file: `Etsy-Inventory-Tracker-Setup.exe`
2. Double-click the file
3. Click "Install" and follow the prompts
4. The system will automatically open in your browser
5. **That's it!** Start managing your inventory!

### For Mac Users:
1. Download the installer file: `Etsy-Inventory-Tracker.dmg`
2. Double-click the file
3. Drag the app to your Applications folder
4. Double-click to launch
5. **That's it!** Start managing your inventory!

### For Linux Users:
1. Download the installer file: `Etsy-Inventory-Tracker.AppImage`
2. Make it executable: `chmod +x Etsy-Inventory-Tracker.AppImage`
3. Double-click to run
4. **That's it!** Start managing your inventory!

---

## 🛠️ MANUAL INSTALLATION (For Advanced Users)

If you prefer to run from source code or the installer doesn't work:

### Prerequisites:
- **Node.js** (version 16 or higher) - Download from https://nodejs.org/

### Installation Steps:

1. **Extract the Files**
   - Unzip the downloaded package to a folder on your computer
   - Example: `C:\InventoryTracker` (Windows) or `~/InventoryTracker` (Mac/Linux)

2. **Open Terminal/Command Prompt**
   - **Windows**: Press `Win + R`, type `cmd`, press Enter
   - **Mac**: Press `Cmd + Space`, type `terminal`, press Enter
   - **Linux**: Press `Ctrl + Alt + T`

3. **Navigate to the Folder**
   ```bash
   cd /path/to/InventoryTracker
   ```
   Replace `/path/to/InventoryTracker` with your actual folder location

4. **Install Dependencies** (First Time Only)
   ```bash
   npm install
   ```
   This will download required packages (takes 1-2 minutes)

5. **Start the System**
   ```bash
   npm start
   ```
   
   The first time you run this:
   - ✅ Database will be created automatically
   - ✅ Configuration files will be set up
   - ✅ Your browser will open automatically
   - ✅ You'll see a welcome message

6. **Access the System**
   - Your browser should open automatically to: `http://localhost:5173`
   - If not, manually open your browser and go to that address

---

## 📖 QUICK START GUIDE

### Option 1: Add Products Manually

1. Click the **"Add Product"** button
2. Fill in the product details:
   - SKU (product code)
   - Name
   - Category
   - Quantity
   - Price
   - Image URL (optional)
3. Click **"Save"**

### Option 2: Import from Your Website (Automated)

1. Click the **"Crawl Website"** tab at the top
2. Enter your website URL (e.g., `https://yourshop.com`)
3. Click **"Start Crawling"**
4. Wait for the crawler to find your products
5. Review and import the products found

### Managing Inventory

- **View All Products**: Main dashboard shows all inventory
- **Search**: Use the search bar to find specific products
- **Filter**: Filter by category, stock level, or source website
- **Edit**: Click on any product to edit details
- **Delete**: Use the delete button to remove products
- **Track Movements**: Record sales, restocks, and transfers

---

## 📊 FEATURES EXPLAINED

### Dashboard View
- **Total Products**: See your complete inventory count
- **Low Stock Alerts**: Products below threshold are highlighted
- **Category Breakdown**: Visual charts of inventory by category
- **Recent Movements**: Track the latest inventory changes

### Product Management
- **SKU System**: Unique codes for each product
- **Image Support**: Attach images to products
- **Custom Categories**: Organize products your way
- **Multi-Source Tracking**: Know which website each product came from

### Web Crawler
- **Smart Detection**: Automatically finds product information
- **Image Extraction**: Captures product images (20+ detection methods!)
- **Batch Import**: Import hundreds of products at once
- **Source Tracking**: Records which website products came from

### Data Export/Import
- **CSV Export**: Download your inventory as spreadsheet
- **JSON Export**: Technical backup format
- **Import**: Upload existing inventory data

---

## 🔒 PRIVACY & DATA SECURITY

### Your Data is 100% Private:
- ✅ **Everything stays on YOUR computer**
- ✅ **No cloud uploads** - ever!
- ✅ **No internet required** after installation
- ✅ **No tracking or analytics**
- ✅ **You own your data completely**

### Data Location:
- All your data is stored in: `[installation-folder]/data/inventory.db`
- This is a SQLite database file - industry standard and secure
- You can back up this file anytime by copying it

---

## ⚙️ ADVANCED CONFIGURATION

### Customizing Settings:

The system creates a `config.json` file on first run. You can edit this to customize:

```json
{
  "databasePath": "data/inventory.db",
  "serverPort": 3001,
  "clientPort": 5173,
  "autoStart": true,
  "openBrowser": true
}
```

- **databasePath**: Where your data is stored
- **serverPort**: Backend server port (change if 3001 is in use)
- **clientPort**: Frontend port (change if 5173 is in use)
- **autoStart**: Whether to start servers automatically
- **openBrowser**: Auto-open browser on startup

### Changing the Low Stock Threshold:

1. Go to the Settings tab
2. Find "Low Stock Threshold"
3. Enter your desired number
4. Products below this quantity will be highlighted

---

## 🛠️ TROUBLESHOOTING

### Problem: Browser doesn't open automatically
**Solution**: Manually open your browser and go to `http://localhost:5173`

### Problem: "Port already in use" error
**Solution**: 
1. Close other programs using ports 3001 or 5173
2. Or edit `config.json` to use different ports

### Problem: Can't see my products
**Solution**: 
1. Check which browser you're using
2. The system uses a centralized database, so all browsers should show the same data
3. Try refreshing the page (F5)

### Problem: Crawler not finding products
**Solution**: 
1. Make sure the website URL is correct (include `https://`)
2. Some websites block automated crawling
3. Try adding products manually instead

### Problem: Images not loading
**Solution**: 
1. Check if the image URL is still valid
2. Some websites prevent external image linking
3. You can download images and re-upload to your own hosting

### Problem: "Database locked" error
**Solution**: 
1. Close all browser tabs with the inventory system
2. Wait 30 seconds
3. Restart the system with `npm start`

---

## 💡 TIPS & TRICKS

### Best Practices:

1. **Regular Backups**: Copy the `data/` folder weekly to a backup location
2. **Use SKUs Consistently**: Helps prevent duplicates
3. **Categorize Products**: Makes searching and filtering easier
4. **Record All Movements**: Track every sale and restock for accurate history
5. **Check Low Stock Weekly**: Stay ahead of inventory needs

### Performance Tips:

- For 1000+ products, increase your browser's cache size
- Use the search/filter instead of scrolling through all products
- Export data periodically to keep the database lean

### Multi-Computer Setup:

You can run this on multiple computers by:
1. Installing on each computer
2. Manually copying the `data/inventory.db` file between computers
3. This keeps inventory synchronized (manual process)

---

## 📞 SUPPORT

### Before Contacting Support:

1. Check this README thoroughly
2. Look at the Troubleshooting section
3. Try restarting the system
4. Check your internet connection (for web crawling only)

### Getting Help:

If you need assistance:
- **Etsy Messages**: Contact me through Etsy messaging
- **Email**: [Your support email]
- **Include**: 
  - Your operating system (Windows/Mac/Linux)
  - What you were trying to do
  - Any error messages you saw
  - Screenshots if possible

I typically respond within 24 hours!

---

## 🔄 UPDATING THE SYSTEM

When a new version is released:

1. **Backup Your Data First!**
   - Copy the entire `data/` folder to a safe location

2. **Download the New Version**
   - Download the updated files from Etsy

3. **Replace Files**
   - Extract the new version to the same location
   - **DO NOT delete the `data/` folder!**

4. **Restart**
   - Run `npm start` again
   - Your data will be preserved

---

## 📋 TECHNICAL DETAILS

For those interested in the technology:

- **Frontend**: React with Vite
- **Backend**: Node.js with Express
- **Database**: SQLite (better-sqlite3)
- **Web Crawler**: Puppeteer + Cheerio
- **Styling**: Tailwind CSS
- **Charts**: Chart.js & Recharts

### System Requirements:
- **OS**: Windows 10+, macOS 10.13+, or Linux (Ubuntu 18.04+)
- **RAM**: Minimum 2GB, 4GB recommended
- **Disk Space**: 500MB for software + your inventory data
- **CPU**: Any modern processor (2GHz+)
- **Internet**: Only needed for web crawling feature

---

## 📜 LICENSE & TERMS

This software is licensed for **personal and commercial use** by the purchaser.

### You MAY:
- ✅ Use on unlimited computers you own
- ✅ Manage inventory for your business
- ✅ Customize the code for your needs
- ✅ Make backups

### You MAY NOT:
- ❌ Resell or redistribute this software
- ❌ Share with others who haven't purchased
- ❌ Remove copyright notices
- ❌ Claim you created this software

---

## 🎉 THANK YOU!

Thank you for choosing **Etsy Inventory Tracker**! I hope this tool makes managing your inventory easier and helps your business grow.

If you find this helpful, please consider:
- ⭐ Leaving a positive review on Etsy
- 📢 Recommending to other sellers
- 💬 Sharing feedback for improvements

Happy selling! 🚀

---

## ✨ CHANGELOG

### Version 1.0.0 (Initial Release)
- ✅ Complete inventory management system
- ✅ Automated web crawler
- ✅ 20+ image detection methods
- ✅ Centralized SQLite database
- ✅ Visual analytics and charts
- ✅ Export/Import functionality
- ✅ Multi-source tracking
- ✅ Automated setup and installation

---

*Etsy Inventory Tracker - Professional Edition*  
*Copyright © 2024 - All Rights Reserved*  
*Made with ❤️ for Etsy Sellers*
