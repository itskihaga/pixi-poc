import { isNext, move, MoveResult } from "./fn";

test("move1", () => {
  const res = move(
    [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: 2 },
      { x: 1, y: 2 },
    ],
    { x: 0, y: 2 }
  );
  const expected: MoveResult = {
    next: [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: 2 },
    ],
    toSelect: [],
    toDeselect: [{ x: 1, y: 2 }],
    crossed: true,
  };
  expect(res).toEqual(expected);
});
test("move2", () => {
  const res = move(
    [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: 2 },
      { x: 1, y: 2 },
    ],
    { x: 2, y: 2 }
  );
  const expected: MoveResult = {
    next: [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: 2 },
      { x: 1, y: 2 },
      { x: 2, y: 2 },
    ],
    toSelect: [{ x: 2, y: 2 }],
    toDeselect: [],
    crossed: false,
  };
  expect(res).toEqual(expected);
});
test("move3", () => {
  const res = move(
    [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: 2 },
      { x: 1, y: 2 },
    ],
    { x: 3, y: 2 }
  );
  const expected: MoveResult = {
    next: [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: 2 },
      { x: 1, y: 2 },
    ],
    toSelect: [],
    toDeselect: [],
    crossed: false,
  };
  expect(res).toEqual(expected);
});
test("isNext", () => {
  const resTrue = isNext({ x: 0, y: 0 }, { x: 0, y: 1 });
  expect(resTrue).toBe(true);
  const resFalse = isNext({ x: 1, y: 0 }, { x: 0, y: 1 });
  expect(resFalse).toBe(false);
});
