export async function optimizeImageFile(file: File): Promise<File> {
  try {
    const isLikelyImage =
      file.type.startsWith('image/') || /\\.(png|jpe?g|gif|webp|heic|heif)$/i.test(file.name);
    if (!isLikelyImage) return file;

    // Skip tiny files
    if (file.size <= 80 * 1024) return file;

    // Load image
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const image = new Image();
      image.onload = () => {
        URL.revokeObjectURL(url);
        resolve(image);
      };
      image.onerror = (e) => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load image for optimization'));
      };
      image.src = url;
    });

    const maxDim = 1024; // Cap dimensions for faster vision inference
    const { naturalWidth: w, naturalHeight: h } = img;
    const scale = Math.min(1, maxDim / Math.max(w, h));

    // If already small, don't process
    if (scale >= 1 && file.size <= 150 * 1024) return file;

    const targetW = Math.max(1, Math.round(w * scale));
    const targetH = Math.max(1, Math.round(h * scale));

    const canvas = document.createElement('canvas');
    canvas.width = targetW;
    canvas.height = targetH;

    const ctx = canvas.getContext('2d');
    if (!ctx) return file;

    // High quality resize hints
    (ctx as any).imageSmoothingEnabled = true;
    (ctx as any).imageSmoothingQuality = 'high';

    ctx.drawImage(img, 0, 0, targetW, targetH);

    // Prefer WebP (keeps transparency, smaller size)
    const quality = 0.8;
    const outType = 'image/webp';

    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob((b) => resolve(b), outType, quality)
    );

    if (!blob) return file;

    // If compressed isn't smaller, keep original
    if (blob.size >= file.size * 0.95) return file;

    const baseName = file.name.replace(/\.[^/.]+$/, '');
    const optimizedName = `${baseName}-opt.webp`;
    return new File([blob], optimizedName, { type: outType });
  } catch {
    // On any failure, just return original file
    return file;
  }
}
