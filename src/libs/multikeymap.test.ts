import { createMultiKeyMap } from "./multikeymap";

test("multikeymap", () => {
  const map = createMultiKeyMap<[number, number, number], string>();
  map.set([1, 2, 3], "1-2-3");
  map.set([0, 2, 3], "0-2-3");
  map.set([1, 2, 4], "0-2-4");
  expect(map.get([1, 2, 3])).toBe("1-2-3");
  expect(map.get([0, 2, 3])).toBe("0-2-3");
  expect(map.get([1, 2, 4])).toBe("0-2-4");
  expect(map.get([1, 2, 5])).toBeUndefined();
});
