# Quick Start: Build All Platform Installers

## 🚀 Option 1: Use GitHub Actions (Recommended - FREE)

Build Windows, Mac, AND Linux installers automatically in the cloud!

### Setup (One-time):

1. **Create GitHub Repository**
   ```bash
   cd "/home/aaron/business/products for etsy"
   git init
   git add .
   git commit -m "Initial commit - Etsy Inventory Tracker"
   ```

2. **Push to GitHub**
   - Create a new repository on GitHub.com
   - Follow GitHub's instructions to push your code
   
   ```bash
   git remote add origin https://github.com/YOUR-USERNAME/etsy-inventory-tracker.git
   git branch -M main
   git push -u origin main
   ```

3. **Trigger Build**
   
   **Method A - Create a version tag:**
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```
   GitHub will automatically build Windows .exe, Mac .dmg, and Linux .AppImage!
   
   **Method B - Manual trigger:**
   - Go to your GitHub repo
   - Click "Actions" tab
   - Click "Build Installers for All Platforms"
   - Click "Run workflow"
   - Click green "Run workflow" button

4. **Download Installers**
   - Go to Actions tab
   - Click on the completed workflow run
   - Scroll down to "Artifacts"
   - Download:
     - `windows-installer` - Contains .exe for Windows
     - `mac-installer` - Contains .dmg for Mac
     - `linux-installer` - Contains .AppImage for Linux

---

## 🛠️ Option 2: Build Locally

### Build on Your Current System (Linux):
```bash
npm run electron:build:linux
```
✅ Output: `dist-electron/Etsy Inventory Tracker-1.0.0.AppImage`

### Build Windows (requires Windows PC):
```bash
npm run electron:build:win
```
Output: `dist-electron/Etsy Inventory Tracker Setup 1.0.0.exe`

### Build Mac (requires Mac):
```bash
npm run electron:build:mac
```
Output: `dist-electron/Etsy Inventory Tracker-1.0.0.dmg`

---

## 📦 What You'll Upload to Etsy

After building, you'll have 3 files:
1. **Windows**: `Etsy Inventory Tracker Setup 1.0.0.exe` (~150MB)
2. **Mac**: `Etsy Inventory Tracker-1.0.0.dmg` (~150MB)
3. **Linux**: `Etsy Inventory Tracker-1.0.0.AppImage` (~118MB)

Upload all 3 to your Etsy listing as digital downloads.

---

## 🎨 Before Building (Optional but Recommended)

### Add Custom App Icon

1. **Create icons** (or use free icon generators):
   - 512x512 PNG for your logo
   - Use online converters:
     - https://www.icoconverter.com/ (PNG → ICO for Windows)
     - https://cloudconvert.com/png-to-icns (PNG → ICNS for Mac)

2. **Save icons**:
   - `build/icon.ico` - Windows icon (256x256)
   - `build/icon.icns` - Mac icon (512x512)
   - `build/icon.png` - Linux icon (512x512)

3. **Rebuild**:
   ```bash
   npm run build
   npm run electron:build
   ```

### Update Your Company Info

Edit `package.json`:
```json
{
  "author": "Your Name <your@email.com>",
  "build": {
    "appId": "com.yourcompany.inventory-tracker"
  }
}
```

---

## 🧪 Test Before Selling

### Test Locally (without building installer):
```bash
npm run electron:dev
```
This opens the app in development mode.

### Test Actual Installer:
1. Build for your platform
2. Install the .exe, .dmg, or .AppImage
3. Verify app opens without terminal
4. Test all features (add product, export data, etc.)

---

## 🎯 GitHub Actions - Detailed Steps

### First Time Setup:

1. **Install Git** (if not already):
   ```bash
   sudo apt install git
   ```

2. **Initialize Git in your project**:
   ```bash
   cd "/home/aaron/business/products for etsy"
   git init
   git config user.name "Your Name"
   git config user.email "your@email.com"
   ```

3. **Commit your code**:
   ```bash
   git add .
   git commit -m "Ready for Etsy - Desktop app with auto-build"
   ```

4. **Create GitHub repo**:
   - Go to https://github.com/new
   - Name: `etsy-inventory-tracker`
   - Make it **Private** (to protect your product)
   - Don't initialize with README (you already have files)
   - Click "Create repository"

5. **Push to GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR-USERNAME/etsy-inventory-tracker.git
   git branch -M main
   git push -u origin main
   ```

6. **Create a release tag to trigger build**:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

7. **Watch the magic happen**:
   - Go to your GitHub repo
   - Click "Actions" tab
   - You'll see "Build Installers for All Platforms" running
   - Wait 10-15 minutes for all 3 platforms to build
   - Download artifacts when complete!

---

## 🔄 Update Your App Later

When you make changes and want to release v1.1.0:

```bash
# Make your code changes
git add .
git commit -m "Added new features"
git push

# Create new version
git tag v1.1.0
git push origin v1.1.0
```

GitHub automatically builds new installers!

---

## 💡 Pro Tips

1. **Keep repo private** - This is your product!
2. **Use semantic versioning** - v1.0.0, v1.1.0, v2.0.0
3. **Test locally first** - Use `npm run electron:dev`
4. **Add icons** - Makes your app look professional
5. **Document changes** - Keep a CHANGELOG.md

---

## ❓ Troubleshooting

**Build fails on GitHub Actions?**
- Check the Actions log for errors
- Make sure package.json is valid
- Ensure all dependencies are listed

**AppImage won't run on Linux?**
- Needs FUSE: `sudo apt install libfuse2`
- Or extract and run: `./Etsy*.AppImage --appimage-extract-and-run`

**Windows build wants code signing?**
- For Etsy, unsigned is fine (customers will see a warning, that's normal)
- Add certificate later if needed

---

## 🎉 Summary

✅ Linux installer already built locally (118MB)
✅ GitHub Actions ready to build Windows + Mac
✅ One command to build all platforms
✅ Etsy-ready digital download files

**Next step**: Push to GitHub, create a tag, download installers, upload to Etsy! 🚀
