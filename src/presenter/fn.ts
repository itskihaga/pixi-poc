import { createStore } from "@/libs/store";

export interface Point {
  x: number;
  y: number;
}

export const isEqual = (a: Point, b: Point): boolean =>
  a.x === b.x && a.y === b.y;
export const isNext = (a: Point, b: Point): boolean =>
  (a.x === b.x && (a.y - b.y === 1 || a.y - b.y === -1)) ||
  ((a.x - b.x === 1 || a.x - b.x === -1) && a.y === b.y);
const getTail = <T>(ary: T[]): T | undefined =>
  ary.length ? ary[ary.length - 1] : undefined;

export type MoveResult = {
  next: Point[];
  toDeselect: Point[];
  toSelect: Point[];
  crossed: boolean;
};
export const move = (points: Point[], nextPoint: Point): MoveResult => {
  const validated = points.reduce<MoveResult>(
    (acc, cur) => {
      if (acc.crossed) {
        return {
          next: acc.next,
          toDeselect: [...acc.toDeselect, cur],
          toSelect: acc.toSelect,
          crossed: true,
        };
      }
      if (isEqual(cur, nextPoint)) {
        return {
          next: [...acc.next, cur],
          toDeselect: acc.toDeselect,
          toSelect: acc.toSelect,
          crossed: true,
        };
      }
      return {
        next: [...acc.next, cur],
        toDeselect: acc.toDeselect,
        toSelect: acc.toSelect,
        crossed: false,
      };
    },
    { next: [], toDeselect: [], toSelect: [], crossed: false }
  );
  const tail = getTail(validated.next);
  return (tail && !isNext(tail, nextPoint)) || validated.crossed
    ? validated
    : {
        ...validated,
        next: [...validated.next, nextPoint],
        toSelect: [nextPoint],
      };
};

type InteractionActions = {
  START: Point;
  END: void;
  MOVE: Point;
  RESET: void;
  // Effects
  SELECT: Point;
  DESELECT: Point;
  RESULTED: Point[];
};
type InteractionState =
  | {
      isTouching: false;
    }
  | {
      isTouching: true;
      points: Point[];
    };
export const createInteractionStore = () => {
  const init: InteractionState = {
    isTouching: false,
  };
  const store = createStore<InteractionState, InteractionActions>(
    {
      START: (_, point) => [
        { isTouching: true, points: [point] },
        { type: "SELECT", value: point },
      ],
      MOVE: (prev, point) => {
        if (prev.isTouching) {
          const result = move(prev.points, point);
          return [
            {
              isTouching: true,
              points: result.next,
            },
            ...result.toSelect.map(
              (e) => ({ type: "SELECT", value: e } as const)
            ),
            ...result.toDeselect.map(
              (e) => ({ type: "DESELECT", value: e } as const)
            ),
          ];
        }
        return prev;
      },
      RESET: (prev) => {
        if (prev.isTouching) {
          const actions = prev.points.map(
            (point) =>
              ({
                type: "DESELECT",
                value: point,
              } as const)
          );
          return [init, ...actions];
        }
        return init;
      },
      END: (prev) => {
        if (prev.isTouching) {
          const actions = prev.points.map(
            (point) =>
              ({
                type: "DESELECT",
                value: point,
              } as const)
          );
          return [init, { type: "RESULTED", value: prev.points }, ...actions];
        }
        return init;
      },
    },
    init
  );
  return store;
};
