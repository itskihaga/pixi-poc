export const createStore = <S, T extends Actions>(
  reducers: Reducers<S, T>,
  init: S
): Store<S, T> => {
  let state = init;
  const subscribers: { [P in keyof T]?: Subscriber<T[P], S>[] } = {};
  return {
    subscribe(key, cb) {
      const ary = subscribers[key];
      if (ary) {
        ary.push(cb);
      } else {
        const newAry = [cb];
        subscribers[key] = newAry;
      }
    },
    publish(key, action) {
      const reducer = reducers[key];
      const prev = state;
      state = reducer ? reducer(state, action) : state;
      subscribers[key]?.forEach((cb) => cb(action, prev, state));
    },
    getState() {
      return state;
    },
  };
};
type Actions = Record<string, unknown>;
type Subscriber<A, S> = (action: A, prev: S, cur: S) => void;

export interface Store<S, T extends Actions> {
  publish<K extends keyof T>(key: K, action: T[K]): void;
  subscribe<K extends keyof T>(key: K, cb: Subscriber<T[K], S>): void; //FIXME: return unsub function
  getState(): S;
}

export type Reducers<S, T extends Actions> = {
  [P in keyof T]?: (prev: S, action: T[P]) => S;
};
