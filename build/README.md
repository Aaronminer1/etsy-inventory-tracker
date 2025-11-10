# App Icons

Place your custom app icons here:

- **icon.png** - 512x512 PNG (used for Linux)
- **icon.ico** - 256x256 ICO (used for Windows)
- **icon.icns** - 512x512 ICNS (used for Mac)

## How to Create Icons

### Option 1: Use Online Converters (Free & Easy)

1. **Create a 512x512 PNG** of your logo/icon
   - Use Canva, Photoshop, GIMP, or any design tool
   - Make it square (512x512 pixels)
   - Save as `icon.png`

2. **Convert to Windows format (.ico)**
   - Go to https://www.icoconverter.com/
   - Upload your icon.png
   - Download the .ico file
   - Save as `icon.ico` in this folder

3. **Convert to Mac format (.icns)**
   - Go to https://cloudconvert.com/png-to-icns
   - Upload your icon.png
   - Download the .icns file
   - Save as `icon.icns` in this folder

### Option 2: Use Default Icons

If you don't add icons, electron-builder will use default Electron icons. Your app will work fine, but won't look as professional.

## Icon Design Tips

✅ **DO:**
- Keep it simple and recognizable at small sizes
- Use high contrast colors
- Make it square (512x512 or 1024x1024)
- Test how it looks at 16x16, 32x32, 256x256
- Use transparent background (PNG)

❌ **DON'T:**
- Use too much detail (won't be visible when small)
- Use text (hard to read at icon size)
- Use very light colors on white background
- Use very similar colors (low contrast)

## Example Icon Ideas for Inventory Tracker

- 📦 Box/package icon
- 📊 Bar chart icon
- 📋 Clipboard with checklist
- 🏷️ Price tag
- 📈 Growth chart
- 🗃️ File cabinet

## Quick Test

After adding icons:
```bash
npm run build
npm run electron:build:linux
```

Your app icon will appear on the desktop and in the taskbar!
