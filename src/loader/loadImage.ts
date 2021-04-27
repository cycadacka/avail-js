import { clamp } from 'math/math';

interface ImageConfig {
  sx?:number;
  sy?:number;
  sw?:number;
  sh?:number;
  cachable?:boolean;
}

const imageCache = new Map<string, HTMLImageElement>();

/**
 * Loads an image.
 */
function loadImage(
  source: string,
  {sx = 0, sy = 0, sw, sh, cachable = true}: ImageConfig,
): Promise<HTMLImageElement> {
  const key = `${source}-${sx}-${sy}-${sw}-${sh}`;
  // Resolve to the cached image if possible.
  if (cachable && imageCache.has(key)) {
    return Promise.resolve(imageCache.get(key)!);
  }

  const sourceImage = new Image();
  sourceImage.crossOrigin = 'anonymous';
  sourceImage.src = source;

  return new Promise<HTMLImageElement>((resolve, reject) => {
    sourceImage.onload = () => {
      // If there is no arguments present, resolve to the source image
      if (sx == null && sy == null && sw == null && sh == null) {
        // Cache if possible.
        if (cachable) {
          imageCache.set(key, sourceImage);
        }

        resolve(sourceImage);
      }

      if (sw == null) {
        sw = sourceImage.width - sx;
      }

      if (sh == null) {
        sh = sourceImage.height - sy;
      }

      // Modify the source image.
      const canvas = document.createElement('canvas');
      canvas.style.display = 'none';
      canvas.width = clamp(sw, 0, sourceImage.width);
      canvas.height = clamp(sh, 0, sourceImage.height);

      canvas.getContext('2d')!.drawImage(sourceImage, -sx, -sy);

      const modifiedImage = new Image();
      modifiedImage.crossOrigin = 'anonymous';
      modifiedImage.src = canvas.toDataURL();

      canvas.remove();

      // Resolve to the modified image and cache if possible.
      modifiedImage.onload = () => {
        if (cachable) {
          imageCache.set(key, modifiedImage);
        }

        resolve(modifiedImage);
      };

      modifiedImage.onerror = sourceImage.onerror;
    };

    sourceImage.onerror = () => {
      reject(new Error(`Failed loading image '${source}'`));
    };
  });
}

export default loadImage;