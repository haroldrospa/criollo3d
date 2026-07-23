from PIL import Image

img = Image.open('LogoCriollo3d.jpeg').convert('RGBA')
width, height = img.size
print(f"Image size: {width}x{height}")

# Make background transparent
# Background is off-white ~ (247, 247, 247) or anything >= 235
datas = img.getdata()
newData = []
for item in datas:
    # Check if pixel is close to background white/gray
    if item[0] > 235 and item[1] > 235 and item[2] > 235:
        newData.append((255, 255, 255, 0)) # transparent
    else:
        newData.append(item)

img.putdata(newData)

# Save full transparent version
img.save('public/LogoCriollo3d_transparent.png')

bbox = img.getbbox()
print(f"Content bbox: {bbox}")

if bbox:
    cropped = img.crop(bbox)
    cropped.save('public/logo_full_transparent.png')
    cropped.save('public/logo.png')

# Save original file into public
img_orig = Image.open('LogoCriollo3d.jpeg')
img_orig.save('public/LogoCriollo3d.jpeg')

# Let's inspect where the emblem circle is located
# Find left-most non-transparent pixel region
emblem_right = 0
for x in range(bbox[0], bbox[2]):
    has_pixel = False
    for y in range(bbox[1], bbox[3]):
        p = img.getpixel((x, y))
        if p[3] > 0:
            has_pixel = True
            break
    # Check for empty column (gap between emblem and text)
    if not has_pixel and x > bbox[0] + 100: # gap after emblem starts
        emblem_right = x
        break

print(f"Detected emblem right boundary: {emblem_right}")

# Also let's crop just the circular emblem on the left if present
# Emblem is in range bbox[0] to emblem_right (or around square aspect)
emblem_width = bbox[3] - bbox[1] # height of content
emblem_box = (bbox[0], bbox[1], bbox[0] + emblem_width, bbox[3])
emblem_crop = img.crop(emblem_box)
emblem_crop.save('public/logo_icon_transparent.png')

print("Saved logo files to public/")
