const fs = require('fs');
const { PNG } = require('pngjs');

fs.createReadStream('public/logo.png')
  .pipe(new PNG({ filterType: 4 }))
  .on('parsed', function() {
    const width = this.width;
    const height = this.height;

    let minX = width, maxX = 0, minY = height, maxY = 0;
    
    // We look for colored pixels of the logo mark on the left side
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (width * y + x) << 2;
        const r = this.data[idx];
        const g = this.data[idx + 1];
        const b = this.data[idx + 2];
        const a = this.data[idx + 3];

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

          const dist = Math.sqrt(Math.pow(cx - cropSize/2, 2) + Math.pow(cy - cropSize/2, 2));
          const isLightBg = r > 215 && g > 215 && b > 215;

          if (dist > radius - 1 || isLightBg) {
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
