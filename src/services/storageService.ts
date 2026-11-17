import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

export interface ImageValidationResult {
  valid: boolean;
  error?: string;
}

export function validateImageFile(file: File): ImageValidationResult {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Please upload a valid image file (JPEG, PNG, WebP, GIF, or SVG).'
    };
  }

  const maxSizeBytes = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: 'Image file size exceeds the 10MB limit.'
    };
  }

  return { valid: true };
}

/**
 * Compresses an image file via an offscreen HTML5 Canvas into a compact JPEG DataURL
 * (< 250KB) so it safely fits within Cloud Firestore's 1MB document limit even when
 * Firebase Cloud Storage is not enabled.
 */
async function compressImageToDataUrl(
  file: File,
  maxWidth: number = 960,
  quality: number = 0.72
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.onload = () => {
      const rawDataUrl = reader.result as string;
      // SVG or tiny files (< 120KB) can be stored directly
      if (file.type === 'image/svg+xml' || rawDataUrl.length < 150_000) {
        resolve(rawDataUrl);
        return;
      }

      const img = new Image();
      img.onerror = () => resolve(rawDataUrl.length < 500_000 ? rawDataUrl : '');
      img.onload = () => {
        try {
          let width = img.naturalWidth || img.width;
          let height = img.naturalHeight || img.height;

          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(rawDataUrl);
            return;
          }

          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);

          let compressed = canvas.toDataURL('image/jpeg', quality);
          // If still large (> 350KB), compress slightly more so Firestore 1MB limit is never hit
          if (compressed.length > 350_000) {
            compressed = canvas.toDataURL('image/jpeg', 0.55);
          }
          if (compressed.length > 500_000) {
            const smallCanvas = document.createElement('canvas');
            const scale = 680 / width;
            smallCanvas.width = 680;
            smallCanvas.height = Math.round(height * scale);
            const sCtx = smallCanvas.getContext('2d');
            if (sCtx) {
              sCtx.fillStyle = '#FFFFFF';
              sCtx.fillRect(0, 0, smallCanvas.width, smallCanvas.height);
              sCtx.drawImage(img, 0, 0, smallCanvas.width, smallCanvas.height);
              compressed = smallCanvas.toDataURL('image/jpeg', 0.55);
            }
          }
          resolve(compressed);
        } catch (err) {
          reject(err);
        }
      };
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
  });
}

export async function uploadImageWithProgress(
  file: File,
  folder: string = 'articles',
  onProgress?: (progressPercent: number) => void
): Promise<string> {
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error || 'Invalid file');
  }

  const fallbackCompressed = async (): Promise<string> => {
    if (onProgress) onProgress(65);
    const dataUrl = await compressImageToDataUrl(file);
    if (!dataUrl || dataUrl.length > 750_000) {
      throw new Error('Image is too large even after compression. Please choose a smaller image or paste an image URL.');
    }
    if (onProgress) onProgress(100);
    return dataUrl;
  };

  try {
    const timestamp = Date.now();
    const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storagePath = `${folder}/${timestamp}_${cleanName}`;
    const fileRef = ref(storage, storagePath);

    const uploadTask = uploadBytesResumable(fileRef, file, {
      contentType: file.type
    });

    return await new Promise<string>((resolve, reject) => {
      let settled = false;

      // Safety timeout (5s) in case Firebase Storage isn't enabled on the Firebase project
      const timeoutId = window.setTimeout(async () => {
        if (settled) return;
        settled = true;
        try {
          uploadTask.cancel();
        } catch {}
        try {
          const url = await fallbackCompressed();
          resolve(url);
        } catch (e) {
          reject(e);
        }
      }, 5000);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          if (settled) return;
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          if (onProgress) onProgress(Math.min(progress, 95));
        },
        async (error) => {
          if (settled) return;
          settled = true;
          window.clearTimeout(timeoutId);
          console.warn('[Storage] Cloud Storage unavailable, using compressed Firestore-safe image:', error?.code || error);
          try {
            const url = await fallbackCompressed();
            resolve(url);
          } catch (e) {
            reject(e);
          }
        },
        async () => {
          if (settled) return;
          settled = true;
          window.clearTimeout(timeoutId);
          try {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            if (onProgress) onProgress(100);
            resolve(downloadUrl);
          } catch (err) {
            try {
              const url = await fallbackCompressed();
              resolve(url);
            } catch (e) {
              reject(e);
            }
          }
        }
      );
    });
  } catch (err: any) {
    return fallbackCompressed();
  }
}
