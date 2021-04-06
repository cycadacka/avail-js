import clamp from "../math/clamp.js";

/** @type {WeakMap<string, HTMLImageElement}} */
const imageCache = new WeakMap();

/**
 *
 * @export
 * @param {string} source Address or URL to source image.
 * @param {object} param
 * @param {number} [param.sx] X-axis position of the crop.
 * @param {number} [param.sy] Y-axis position of the crop.
 * @param {number} [param.sw] Width of the crop.
 * @param {number} [param.sh] Height of the crop.
 * @param {boolean} [param.cachable] If the image is cacheable. Reverts to true.
 * @returns {Promise<HTMLImageElement>}
 */
function loadImage(
  source,
  { sx = 0, sy = 0, sw = null, sh = null, cachable = true },
) {
  const key = `${source}-${sx}-${sy}-${sw}-${sh}`;
  // Resolve to the cached image if possible.
  if (cachable && imageCache.has(key)) {
    return Promise.resolve(imageCache.get(key));
  }

  const sourceImage = new Image();
  sourceImage.crossOrigin = "anonymous";
  sourceImage.src = source;

  return new Promise((resolve, reject) => {
    sourceImage.onload = () => {
      // If there is no arguments present, resolve to the source image
      if (!(sx && sy && sw && sh)) {
        // Cache if possible.
        if (cachable) {
          imageCache.set(key, sourceImage);
        }

        resolve(sourceImage);
      }

      // Modify the source image.
      const canvas = document.createElement("canvas");
      canvas.style.display = "none";
      canvas.width = clamp(
        Number.isFinite(sw) ? sw : sourceImage.width - sx,
        0,
        sourceImage.width,
      );
      canvas.height = clamp(
        Number.isFinite(sh) ? sh : texture.height - sy,
        0,
        sourceImage.height,
      );

      canvas.getContext("2d").drawImage(sourceImage, -sx, -sy);

      const modifiedImage = new Image();
      modifiedImage.crossOrigin = "anonymous";
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
