import { fn } from "./fn";

test("fn1", () => {
  const res = fn(
    [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: 2 },
      { x: 1, y: 2 },
    ],
    { x: 0, y: 2 }
  );
  expect(res).toEqual([
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: 2 },
  ]);
});
test("fn2", () => {
  const res = fn(
    [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: 2 },
      { x: 1, y: 2 },
    ],
    { x: 2, y: 2 }
  );
  expect(res).toEqual([
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: 2 },
    { x: 1, y: 2 },
    { x: 2, y: 2 },
  ]);
});
