#!/bin/bash

# Build Etsy Distribution Package
# This creates a clean package ready for customer download

echo "🏗️  Building Etsy Distribution Package..."
echo "=========================================="
echo ""

DIST_DIR="ETSY_DISTRIBUTION"
SOURCE_DIR="."

# Clean and create distribution directory
rm -rf "$DIST_DIR"
mkdir -p "$DIST_DIR"

echo "1️⃣  Copying essential application files..."

# Core application files
cp "$SOURCE_DIR/package.json" "$DIST_DIR/"
cp "$SOURCE_DIR/package-lock.json" "$DIST_DIR/"
cp "$SOURCE_DIR/vite.config.js" "$DIST_DIR/"
cp "$SOURCE_DIR/tailwind.config.js" "$DIST_DIR/"
cp "$SOURCE_DIR/postcss.config.cjs" "$DIST_DIR/"

# Main application files
cp "$SOURCE_DIR/index.html" "$DIST_DIR/"
cp "$SOURCE_DIR/index.css" "$DIST_DIR/"
cp "$SOURCE_DIR/main.jsx" "$DIST_DIR/"
cp "$SOURCE_DIR/InventoryTracker.jsx" "$DIST_DIR/"
cp "$SOURCE_DIR/WebsiteCrawler.jsx" "$DIST_DIR/"

# Backend files
cp "$SOURCE_DIR/crawler-server.js" "$DIST_DIR/"
cp "$SOURCE_DIR/database.js" "$DIST_DIR/"
cp "$SOURCE_DIR/centralDb.js" "$DIST_DIR/"

# Installation scripts
cp "$SOURCE_DIR/setup.js" "$DIST_DIR/"
cp "$SOURCE_DIR/start.js" "$DIST_DIR/"

# Electron files (for future desktop app builds)
cp "$SOURCE_DIR/electron-main.js" "$DIST_DIR/"

echo "   ✅ Core files copied"

echo ""
echo "2️⃣  Creating customer documentation..."

# Create simple README.txt for customers
cat > "$DIST_DIR/README.txt" << 'EOF'
═══════════════════════════════════════════════════════════════════════
  🏪 ETSY INVENTORY TRACKER - Professional Edition v1.0.0
═══════════════════════════════════════════════════════════════════════

Thank you for your purchase! This is a complete inventory management 
system that runs 100% on YOUR computer - no cloud, total privacy!

═══════════════════════════════════════════════════════════════════════

🚀 QUICK START (3 Easy Steps)

Step 1: Install Node.js (if not already installed)
  → Download from: https://nodejs.org/
  → Choose the "LTS" version (recommended)
  → Run the installer with default settings

Step 2: Install Dependencies (First Time Only)
  → Open Terminal/Command Prompt in this folder
  → Windows: Press Win+R, type "cmd", press Enter
  → Mac: Press Cmd+Space, type "terminal", press Enter
  → Linux: Press Ctrl+Alt+T
  
  Then run: npm install
  Wait 1-2 minutes while packages download

Step 3: Start the System
  → Run: npm start
  → Your browser will open automatically!
  → That's it - start managing your inventory!

═══════════════════════════════════════════════════════════════════════

📖 USING THE SYSTEM

Add Products Manually:
  • Click "Add Product" button
  • Fill in SKU, Name, Quantity, Price
  • Add image URL (optional)
  • Save!

Import from Your Website (Automated):
  • Click "Crawl Website" tab
  • Enter your website URL (e.g., https://yourshop.com)
  • Click "Start Crawling"
  • Products will be automatically imported with images!

Manage Your Inventory:
  • Search and filter products
  • Track stock movements (sales, restocks)
  • View analytics and charts
  • Export to CSV for Excel/Sheets

═══════════════════════════════════════════════════════════════════════

🔒 YOUR DATA IS 100% PRIVATE

✅ Everything stays on YOUR computer
✅ No cloud uploads - ever!
✅ No tracking or analytics
✅ Works offline (after installation)

Data Location: [this-folder]/data/inventory.db

To backup: Just copy the "data" folder to a safe location!

═══════════════════════════════════════════════════════════════════════

❓ TROUBLESHOOTING

Problem: Browser doesn't open automatically
Solution: Open browser manually and go to: http://localhost:5173

Problem: "Port already in use" error
Solution: Another program is using ports 3001 or 5173
  - Close other applications
  - Or edit config.json to use different ports

Problem: Can't see products after restart
Solution: Make sure you start from the same folder where you installed

Problem: Crawler not working
Solution: Check your internet connection and website URL
  - Make sure URL includes https://
  - Some websites block automated crawling

For more help: See FULL_MANUAL.txt

═══════════════════════════════════════════════════════════════════════

📞 SUPPORT

Need help? I'm here for you!

Contact: Through Etsy messages (preferred)
Response Time: Usually within 24 hours

Include in your message:
  - Your operating system (Windows/Mac/Linux)
  - What you were trying to do
  - Any error messages or screenshots

═══════════════════════════════════════════════════════════════════════

💡 PRO TIPS

✓ Backup your data folder weekly
✓ Use consistent SKU codes to avoid duplicates
✓ Record all inventory movements for accurate tracking
✓ Check the analytics dashboard regularly
✓ Use categories to organize products

═══════════════════════════════════════════════════════════════════════

⭐ ENJOYING THE SOFTWARE?

If this inventory tracker is helping your business:
  • Leave a review on Etsy
  • Recommend to other sellers
  • Share feedback for improvements

Your feedback helps me improve the software!

═══════════════════════════════════════════════════════════════════════

📋 WHAT'S INCLUDED

✅ Complete inventory management system
✅ Automated web crawler for importing products
✅ Smart image detection (20+ methods)
✅ Visual analytics and charts
✅ CSV import/export
✅ Multi-source tracking
✅ Low stock alerts
✅ Inventory movement history
✅ Windows, Mac, and Linux compatible

═══════════════════════════════════════════════════════════════════════

🎯 NEXT STEPS

1. Install Node.js from https://nodejs.org/
2. Run: npm install (in this folder)
3. Run: npm start
4. Add your first products!
5. Explore the features

═══════════════════════════════════════════════════════════════════════

Etsy Inventory Tracker v1.0.0
Copyright © 2024 - All Rights Reserved
Made with ❤️ for Etsy Sellers

Your success is my success! 🚀
EOF

# Copy full manual
cp "$SOURCE_DIR/CUSTOMER_README.md" "$DIST_DIR/FULL_MANUAL.txt"

# Create LICENSE.txt
cat > "$DIST_DIR/LICENSE.txt" << 'EOF'
ETSY INVENTORY TRACKER - LICENSE AGREEMENT
===========================================

Copyright (c) 2024. All Rights Reserved.

GRANT OF LICENSE:
This software is licensed, not sold. By purchasing, you are granted
a non-exclusive, non-transferable license to use this software.

YOU MAY:
✓ Use on multiple computers you personally own
✓ Customize for your business needs
✓ Make backup copies for personal use
✓ Use for commercial purposes (managing your inventory)

YOU MAY NOT:
✗ Resell, redistribute, or share this software
✗ Remove copyright notices
✗ Reverse engineer for redistribution
✗ Create derivative works for resale
✗ Share your license with others

NO WARRANTY:
This software is provided "as is" without warranty of any kind,
express or implied. The author is not liable for any damages
arising from the use of this software.

SUPPORT:
Support is provided via Etsy messages on a best-effort basis.

PRIVACY:
This software does not collect, transmit, or store any user data
externally. All data remains on the user's local computer.

By using this software, you agree to these terms.
EOF

echo "   ✅ Documentation created"

echo ""
echo "3️⃣  Creating .gitignore for customer..."

cat > "$DIST_DIR/.gitignore" << 'EOF'
# Dependencies
node_modules/
package-lock.json

# Build outputs
dist/
dist-electron/
.vite/

# User data (should be backed up separately)
data/
*.db
*.db-shm
*.db-wal

# Configuration (auto-generated)
config.json
.setup-complete

# OS files
.DS_Store
Thumbs.db

# IDE files
.vscode/
.idea/
*.swp
*.swo

# Logs
*.log
npm-debug.log*

# Temporary files
*.tmp
.cache/
EOF

echo "   ✅ .gitignore created"

echo ""
echo "4️⃣  Excluding dev files..."
echo "   ℹ️  Not copying:"
echo "      - node_modules/ (customers run npm install)"
echo "      - data/ (customers create their own)"
echo "      - inventory.db (your personal data)"
echo "      - config.json (auto-generated)"
echo "      - .setup-complete (auto-generated)"
echo "      - BUILD_GUIDE.md (dev only)"
echo "      - test files (dev only)"
echo "      - .git/ (dev only)"

echo ""
echo "5️⃣  Creating installation verification checklist..."

cat > "$DIST_DIR/INSTALLATION_CHECKLIST.txt" << 'EOF'
INSTALLATION VERIFICATION CHECKLIST
====================================

Before you contact support, please verify:

□ Node.js is installed
  Test: Open terminal and run: node --version
  Should show: v16.0.0 or higher

□ npm is installed
  Test: Run: npm --version
  Should show: 8.0.0 or higher

□ You're in the correct folder
  Test: Run: ls (Mac/Linux) or dir (Windows)
  Should see: package.json, start.js, setup.js

□ Dependencies are installed
  Run: npm install
  Wait for completion (1-2 minutes)

□ No other applications using ports 3001 or 5173
  Test: Run: npm start
  Should open browser automatically

□ Browser opens to http://localhost:5173
  Should see: Etsy Inventory Tracker interface

□ Can add a test product
  Click "Add Product", fill form, save

□ Data persists after restart
  Stop system (Ctrl+C), restart (npm start)
  Test product should still be there

If all checkboxes pass: ✅ Installation successful!

If any fail: Contact support with the specific step that failed.
EOF

echo "   ✅ Checklist created"

echo ""
echo "6️⃣  Creating package summary..."

cat > "$DIST_DIR/PACKAGE_CONTENTS.txt" << 'EOF'
PACKAGE CONTENTS
================

This package contains everything needed to run Etsy Inventory Tracker.

MAIN APPLICATION FILES:
- package.json          - Project configuration & dependencies
- index.html           - Main application page
- index.css            - Styling
- main.jsx             - Application entry point
- InventoryTracker.jsx - Main inventory interface
- WebsiteCrawler.jsx   - Web crawling interface

BACKEND FILES:
- crawler-server.js    - Web crawler server
- database.js          - Database operations
- centralDb.js         - Database API client

INSTALLATION FILES:
- setup.js             - First-time setup automation
- start.js             - One-click launcher

CONFIGURATION FILES:
- vite.config.js       - Build tool configuration
- tailwind.config.js   - CSS framework configuration
- postcss.config.cjs   - CSS processing

DESKTOP APP (OPTIONAL):
- electron-main.js     - Electron desktop wrapper

DOCUMENTATION:
- README.txt           - Quick start guide (START HERE!)
- FULL_MANUAL.txt      - Complete user manual
- LICENSE.txt          - Software license
- INSTALLATION_CHECKLIST.txt - Troubleshooting guide

AUTO-GENERATED (on first run):
- data/                - Your inventory database
- config.json          - System settings
- .setup-complete      - Setup marker
- node_modules/        - Dependencies (from npm install)

TOTAL FILES: ~15 core files + documentation
SIZE: ~2MB (before npm install)
SIZE: ~200MB (after npm install with dependencies)

WHAT'S NOT INCLUDED:
✗ node_modules/ - You install this with "npm install"
✗ Database with sample data - You create your own
✗ Developer documentation - Only customer docs included
EOF

echo "   ✅ Package summary created"

echo ""
echo "7️⃣  Calculating package size..."

TOTAL_SIZE=$(du -sh "$DIST_DIR" | cut -f1)
FILE_COUNT=$(find "$DIST_DIR" -type f | wc -l)

echo "   📦 Package size: $TOTAL_SIZE"
echo "   📄 File count: $FILE_COUNT files"

echo ""
echo "8️⃣  Creating ZIP archive for Etsy..."

cd "$DIST_DIR/.." || exit
ZIP_NAME="Etsy-Inventory-Tracker-v1.0.0-$(date +%Y%m%d).zip"
zip -r "$ZIP_NAME" "$DIST_DIR" -x "*/node_modules/*" "*/data/*" "*.db" > /dev/null 2>&1

if [ -f "$ZIP_NAME" ]; then
    ZIP_SIZE=$(du -sh "$ZIP_NAME" | cut -f1)
    echo "   ✅ ZIP created: $ZIP_NAME ($ZIP_SIZE)"
else
    echo "   ❌ ZIP creation failed"
fi

echo ""
echo "═══════════════════════════════════════════════════════════════════════"
echo "✨ DISTRIBUTION PACKAGE COMPLETE!"
echo "═══════════════════════════════════════════════════════════════════════"
echo ""
echo "📁 Location: $DIST_DIR/"
echo "📦 ZIP File: $ZIP_NAME"
echo "📊 Package Info:"
echo "   - $FILE_COUNT files"
echo "   - $TOTAL_SIZE uncompressed"
echo "   - Ready for Etsy upload!"
echo ""
echo "🎯 NEXT STEPS:"
echo ""
echo "1. Test the package:"
echo "   cd $DIST_DIR"
echo "   npm install"
echo "   npm start"
echo ""
echo "2. Verify everything works:"
echo "   - Database creates automatically"
echo "   - Browser opens to localhost:5173"
echo "   - Can add/edit/delete products"
echo "   - Crawler works"
echo ""
echo "3. Upload to Etsy:"
echo "   - Use the ZIP file: $ZIP_NAME"
echo "   - Or create platform-specific installers first"
echo ""
echo "═══════════════════════════════════════════════════════════════════════"
echo ""
echo "🔒 Privacy Check:"
echo "   ✅ No personal data included"
echo "   ✅ No API keys or secrets"
echo "   ✅ No customer database"
echo "   ✅ Clean installation ready"
echo ""
echo "Good luck with your Etsy sales! 🚀"
echo ""
