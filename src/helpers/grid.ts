export const gridCells = (n: number) => {
  return n * 16;
};

export const isSpaceFree = (walls: Set<any>, x: number, y: number) => {
  const str = `${x},${y}`;
  const isWallPresent = walls.has(str);

  return !isWallPresent;
};
