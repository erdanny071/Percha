import type { ColorBucket } from "@/types";

// Compress a File to a JPEG data URL (max width 640px, quality 0.75).
export function fileToCompressedDataUrl(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => {
      const img = new Image();
      img.onload = () => {
        const maxW = 640;
        const scale = Math.min(1, maxW / img.width);
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const c = document.createElement("canvas");
        c.width = w;
        c.height = h;
        const ctx = c.getContext("2d")!;
        ctx.drawImage(img, 0, 0, w, h);
        res(c.toDataURL("image/jpeg", 0.75));
      };
      img.onerror = rej;
      img.src = r.result as string;
    };
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

// Determine the dominant color bucket from an image data URL.
export function colorBucketFromDataUrl(dataUrl: string): Promise<ColorBucket> {
  return new Promise((resolve) => {
    try {
      const img = new Image();
      img.onload = () => {
        const w = 40;
        const h = 40;
        const c = document.createElement("canvas");
        c.width = w;
        c.height = h;
        const ctx = c.getContext("2d")!;
        ctx.drawImage(img, 0, 0, w, h);
        try {
          const d = ctx.getImageData(0, 0, w, h).data;
          let r = 0;
          let g = 0;
          let b = 0;
          let cnt = 0;
          for (let i = 0; i < d.length; i += 4) {
            if (d[i + 3] < 120) continue;
            r += d[i];
            g += d[i + 1];
            b += d[i + 2];
            cnt++;
          }
          if (cnt === 0) return resolve("grey");
          r = Math.round(r / cnt);
          g = Math.round(g / cnt);
          b = Math.round(b / cnt);
          const rn = r / 255;
          const gn = g / 255;
          const bn = b / 255;
          const max = Math.max(rn, gn, bn);
          const min = Math.min(rn, gn, bn);
          const l = (max + min) / 2;
          const dlt = max - min;
          let s = 0;
          let hue = 0;
          if (dlt !== 0) {
            s = dlt / (1 - Math.abs(2 * l - 1));
            switch (max) {
              case rn:
                hue = ((gn - bn) / dlt) % 6;
                break;
              case gn:
                hue = (bn - rn) / dlt + 2;
                break;
              case bn:
                hue = (rn - gn) / dlt + 4;
                break;
            }
            hue = Math.round(hue * 60);
            if (hue < 0) hue += 360;
          }
          if (l < 0.12) return resolve("black");
          if (l > 0.88) return resolve("white");
          if (s < 0.12) return resolve("grey");
          if (hue >= 0 && hue < 15) return resolve("red");
          if (hue >= 15 && hue < 45) return resolve("orange");
          if (hue >= 45 && hue < 65) return resolve("yellow");
          if (hue >= 65 && hue < 170) return resolve("green");
          if (hue >= 170 && hue < 260) return resolve("blue");
          if (hue >= 260 && hue < 300) return resolve("purple");
          return resolve("pink");
        } catch {
          resolve("grey");
        }
      };
      img.onerror = () => resolve("grey");
      img.src = dataUrl;
    } catch {
      resolve("grey");
    }
  });
}
