from PIL import Image, ImageFilter
import math

# Load the exact user image
img_path = 'LogoCriollo3d.jpeg'
img = Image.open(img_path).convert('RGBA')
width, height = img.size

# Function to check if a pixel is background (light grey / off-white / very light cyan background)
def is_background(r, g, b):
    # Background color in JPEG is around (247, 247, 247) or light gray/cyan background
    if r > 215 and g > 215 and b > 215:
        return True
    if r > 210 and g > 230 and b > 230:
        return True
    return False

# 1. Save original exact JPEG to public
img_orig = Image.open(img_path)
img_orig.save('public/LogoCriollo3d.jpeg', quality=95)
img_orig.save('public/logo.jpeg', quality=95)

# 2. Process Full Logo Transparency
datas = img.getdata()
newData = []
for item in datas:
    r, g, b, a = item
    if is_background(r, g, b):
        newData.append((0, 0, 0, 0)) # Fully transparent
    else:
        newData.append((r, g, b, 255))

img_transparent = Image.new('RGBA', (width, height))
img_transparent.putdata(newData)
img_transparent.save('public/LogoCriollo3d_transparent.png')

# Bounding box of all non-transparent pixels
bbox = img_transparent.getbbox()
print("Full logo bounding box:", bbox)

if bbox:
    cropped_full = img_transparent.crop(bbox)
    cropped_full.save('public/logo_full_transparent.png')
    cropped_full.save('public/logo.png')

# 3. Process Circular / Icon Emblem (X: 0 to ~460)
# Let's crop emblem region
emblem_region = img_transparent.crop((0, 0, 461, height))
emblem_bbox = emblem_region.getbbox()
print("Emblem bounding box:", emblem_bbox)

if emblem_bbox:
    # Make square emblem
    ew = emblem_bbox[2] - emblem_bbox[0]
    eh = emblem_bbox[3] - emblem_bbox[1]
    max_dim = max(ew, eh)
    
    # Square box centered on emblem
    center_x = (emblem_bbox[0] + emblem_bbox[2]) / 2.0
    center_y = (emblem_bbox[1] + emblem_bbox[3]) / 2.0
    
    half_size = max_dim / 2.0 + 4
    sq_box = (
        max(0, int(center_x - half_size)),
        max(0, int(center_y - half_size)),
        min(width, int(center_x + half_size)),
        min(height, int(center_y + half_size))
    )
    
    emblem_square = img_transparent.crop(sq_box)
    emblem_square.save('public/logo_icon_transparent.png')
    
    # Create high-res circular favicon / icon png
    emblem_square.resize((192, 192), Image.Resampling.LANCZOS).save('public/android-chrome-192x192.png')
    emblem_square.resize((32, 32), Image.Resampling.LANCZOS).save('public/favicon.ico')
    emblem_square.resize((180, 180), Image.Resampling.LANCZOS).save('public/apple-touch-icon.png')

print("Logo generation complete!")
