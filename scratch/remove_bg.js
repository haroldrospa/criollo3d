const fs = require('fs');
const { PNG } = require('pngjs');

fs.createReadStream('public/logo.png')
  .pipe(new PNG({ filterType: 4 }))
  .on('parsed', function() {
    const width = this.width;
    const height = this.height;

    // Find center and radius of the circular emblem
    // Usually the emblem is on the left side of logo.png or centered if cropped.
    // Let's inspect bounding box of non-white pixels on the left half or full image.

    // Let's find the circle bounds
    let minX = width, maxX = 0, minY = height, maxY = 0;
    
    // We look for pixels that are colored (teal or dark gray)
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (width * y + x) << 2;
        const r = this.data[idx];
        const g = this.data[idx + 1];
        const b = this.data[idx + 2];
        const a = this.data[idx + 3];

        // If it's not transparent and not white/light gray background (e.g. background > 230)
        // Check if pixel is teal/cyan (r < 50, g > 100, b > 140) or dark gray (r < 100, g < 100, b < 100)
        const isTealOrGray = (g > 100 && b > 120 && r < 100) || (r < 100 && g < 100 && b < 100) || (b > 130 && r < 80);
        
        if (a > 0 && isTealOrGray) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }

    console.log(`Detected circle bounds: minX=${minX}, maxX=${maxX}, minY=${minY}, maxY=${maxY}`);

    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    const radius = Math.max((maxX - minX) / 2, (maxY - minY) / 2) + 2;

    // Crop box around circle
    const cropSize = Math.ceil(radius * 2 + 8);
    const croppedPNG = new PNG({ width: cropSize, height: cropSize });

    const startX = Math.round(centerX - cropSize / 2);
    const startY = Math.round(centerY - cropSize / 2);

    for (let cy = 0; cy < cropSize; cy++) {
      for (let cx = 0; cx < cropSize; cx++) {
        const srcX = startX + cx;
        const srcY = startY + cy;
        const outIdx = (cropSize * cy + cx) << 2;

        if (srcX >= 0 && srcX < width && srcY >= 0 && srcY < height) {
          const srcIdx = (width * srcY + srcX) << 2;
          const r = this.data[srcIdx];
          const g = this.data[srcIdx + 1];
          const b = this.data[srcIdx + 2];

          // Calculate distance from center of circle
          const dist = Math.sqrt(Math.pow(cx - cropSize/2, 2) + Math.pow(cy - cropSize/2, 2));

          // If outside circle or light background pixel
          const isLightBg = r > 210 && g > 210 && b > 210;

          if (dist > radius || isLightBg) {
            croppedPNG.data[outIdx] = 0;
            croppedPNG.data[outIdx + 1] = 0;
            croppedPNG.data[outIdx + 2] = 0;
            croppedPNG.data[outIdx + 3] = 0; // 100% transparent
          } else {
            croppedPNG.data[outIdx] = r;
            croppedPNG.data[outIdx + 1] = g;
            croppedPNG.data[outIdx + 2] = b;
            croppedPNG.data[outIdx + 3] = 255;
          }
        } else {
          croppedPNG.data[outIdx + 3] = 0;
        }
      }
    }

    croppedPNG.pack().pipe(fs.createWriteStream('public/logo_icon_transparent.png'))
      .on('finish', () => {
        console.log('Successfully saved public/logo_icon_transparent.png!');
      });
  });
