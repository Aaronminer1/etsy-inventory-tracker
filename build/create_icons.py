#!/usr/bin/env python3
from PIL import Image, ImageDraw, ImageFont
import os

# Create a 256x256 icon
size = 256
img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
draw = ImageDraw.Draw(img)

# Draw a blue rounded rectangle background
margin = 20
draw.rounded_rectangle([margin, margin, size-margin, size-margin], 
                      radius=20, fill='#3B82F6')

# Add "IT" text in white
try:
    # Try to use a system font
    font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 80)
except:
    # Fallback to default font
    font = ImageFont.load_default()

text = "IT"
bbox = draw.textbbox((0, 0), text, font=font)
text_width = bbox[2] - bbox[0]
text_height = bbox[3] - bbox[1]
x = (size - text_width) // 2
y = (size - text_height) // 2 - 10

draw.text((x, y), text, fill='white', font=font)

# Save as PNG
img.save('icon.png')

# Create ICO (multiple sizes)
icon_sizes = [(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)]
icons = []
for icon_size in icon_sizes:
    resized = img.resize(icon_size, Image.Resampling.LANCZOS)
    icons.append(resized)

icons[0].save('icon.ico', format='ICO', sizes=[(icon.width, icon.height) for icon in icons])

# For Mac, just copy the PNG (ICNS creation is complex)
img.save('icon.icns.png')  # We'll rename this

print("Icons created successfully!")
