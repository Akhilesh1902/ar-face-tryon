export function getCoverOffsets(
  videoWidth: number,
  videoHeight: number,
  containerWidth: number,
  containerHeight: number
) {
  const videoAspect = videoWidth / videoHeight;
  const containerAspect = containerWidth / containerHeight;

  let scale = 1;
  let offsetX = 0;
  let offsetY = 0;

  if (containerAspect > videoAspect) {
    // Wider container → video scaled by width
    scale = containerWidth / videoWidth;
    offsetY = (videoHeight * scale - containerHeight) / 2;
  } else {
    // Taller container → video scaled by height
    scale = containerHeight / videoHeight;
    offsetX = (videoWidth * scale - containerWidth) / 2;
  }

  return { scale, offsetX, offsetY };
}
