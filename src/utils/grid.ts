/**
 * Converts a grid cell index to pixel position.
 * Assumes each grid cell is 16x16 pixels.
 *
 * @param n - The grid cell index (in tiles).
 * @returns - The pixel position corresponding to the grid cell.
 */
export const gridCells = (n: number) => {
  return n * 16;
};

/**
 * Checks if a specific grid coordinate is free (not blocked by a wall).
 * @param walls - A set of occupied positions, stored as "x,y" strings.
 * @param x - The x position to check (in pixels).
 * @param y - The y position to check (in pixels).
 * @returns - True if the space is free, false if occupied by a wall.
 */
export const isSpaceFree = (walls: Set<any>, x: number, y: number): boolean => {
  const key = `${x},${y}`;
  return !walls.has(key);
};
