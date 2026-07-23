from PIL import Image, ImageOps

img_path = 'LogoCriollo3d.jpeg'
img = Image.open(img_path).convert('RGB')
w, h = img.size

# 1. Save original exact user JPEG to public
img.save('public/LogoCriollo3d.jpeg', quality=95)
img.save('public/logo.jpeg', quality=95)

# Create transparent RGBA image with smooth alpha edge removal
out_img = Image.new('RGBA', (w, h))

for y in range(h):
    for x in range(w):
        r, g, b = img.getpixel((x, y))
        
        # Distance from background light grey (247, 247, 247)
        # Background is high lightness and low saturation
        dr = abs(r - 247)
        dg = abs(g - 247)
        db = abs(b - 247)
        dist = (dr + dg + db) / 3.0
        
        # Also check general lightness
        min_c = min(r, g, b)
        max_c = max(r, g, b)
        
        if min_c > 235 and max_c > 240:
            alpha = 0
        elif dist < 12 and min_c > 220:
            alpha = 0
        elif dist < 30 and min_c > 210:
            # Smooth transition for anti-aliasing edge pixels
            alpha = int(((dist - 12) / 18.0) * 255)
            alpha = max(0, min(255, alpha))
        else:
            alpha = 255
            
        out_img.putpixel((x, y), (r, g, b, alpha))

out_img.save('public/LogoCriollo3d_transparent.png')

# Bounding box of content
bbox = out_img.getbbox()
print("BBox:", bbox)

if bbox:
    cropped_full = out_img.crop(bbox)
    cropped_full.save('public/logo_full_transparent.png')
    cropped_full.save('public/logo.png')

# Crop Emblem (leftmost non-transparent object, approx column 0..460)
emblem_box = (0, 0, 461, h)
emblem_crop = out_img.crop(emblem_box)
emblem_bbox = emblem_crop.getbbox()

if emblem_bbox:
    ew = emblem_bbox[2] - emblem_bbox[0]
    eh = emblem_bbox[3] - emblem_bbox[1]
    dim = max(ew, eh)
    cx = (emblem_bbox[0] + emblem_bbox[2]) / 2.0
    cy = (emblem_bbox[1] + emblem_bbox[3]) / 2.0
    
    padding = 10
    sq_box = (
        max(0, int(cx - dim/2.0 - padding)),
        max(0, int(cy - dim/2.0 - padding)),
        min(w, int(cx + dim/2.0 + padding)),
        min(h, int(cy + dim/2.0 + padding))
    )
    
    sq_emblem = out_img.crop(sq_box)
    sq_emblem.save('public/logo_icon_transparent.png')
    
    # Save standard favicons
    sq_emblem.resize((192, 192), Image.Resampling.LANCZOS).save('public/android-chrome-192x192.png')
    sq_emblem.resize((32, 32), Image.Resampling.LANCZOS).save('public/favicon.ico')
    sq_emblem.resize((180, 180), Image.Resampling.LANCZOS).save('public/apple-touch-icon.png')

print("Perfect logo processing complete!")
