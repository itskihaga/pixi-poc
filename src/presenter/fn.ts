export interface Point {
  x: number;
  y: number;
}

export const isEqual = (a: Point, b: Point): boolean =>
  a.x === b.x && a.y === b.y;
export const fn = (points: Point[], current: Point): Point[] => {
  const f = (i: number, acc: Point[]): Point[] => {
    const res = points[i];
    if (res) {
      return isEqual(res, current) ? [...acc, res] : f(i + 1, [...acc, res]);
    }
    return [...acc, current];
  };
  return f(0, []);
};
