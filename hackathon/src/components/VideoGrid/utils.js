export const getBestFit = (containerWidth, containerHeight, numRects, aspectRatio) => {
  let best = { area: 0, cols: 0, rows: 0, width: 0, height: 0 };

  // For each combination of rows + cols that can fit
  // the number of rectangles, place them and see the area.
  for (let cols = numRects; cols > 0; cols--) {
    const rows = Math.ceil(numRects / cols);
    const hScale = containerWidth / (cols * aspectRatio);
    const vScale = containerHeight / rows;
    let width;
    let height;

    // Determine which axis is the constraint.
    if (hScale <= vScale) {
      width = containerWidth / cols;
      height = width / aspectRatio;
    } else {
      height = containerHeight / rows;
      width = height * aspectRatio;
    }
    const area = width * height;
    if (area > best.area) {
      best = {area, width: width - 20, height: height - 10, rows, cols};
    }
  }
  return best;
}
