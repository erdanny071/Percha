export function dataUrlToBlob(dataUrl: string): Blob | null {
  const match = dataUrl.match(/^data:(.+);base64,(.*)$/);
  if (!match) return null;
  const [, mime, base64] = match;
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

export function fileToCompressedDataUrl(file: File, maxSize = 640, quality = 0.75): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error ?? new Error('No se pudo leer la imagen.'));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error('La imagen no es válida.'));
      image.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(image.naturalWidth, image.naturalHeight));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
        canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('No se pudo procesar la imagen.'));
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

const imageObjectUrls: Record<string, string> = {};

export function getImageObjectUrl(id: string): string | undefined {
  return imageObjectUrls[id];
}

export function setImageObjectUrl(id: string, blob: Blob): string {
  revokeImageObjectUrl(id);
  const url = URL.createObjectURL(blob);
  imageObjectUrls[id] = url;
  return url;
}

export function revokeImageObjectUrl(id: string): void {
  const url = imageObjectUrls[id];
  if (!url) return;
  URL.revokeObjectURL(url);
  delete imageObjectUrls[id];
}

export function revokeAllImageObjectUrls(): void {
  Object.keys(imageObjectUrls).forEach(revokeImageObjectUrl);
}
