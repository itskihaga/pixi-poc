export const createStore = <S extends State, T extends Actions>(
  reducers: Reducers<S, T>,
  init: S
): Store<S, T> => {
  let state = init;
  const subscribers: { [P in keyof T]?: Subscriber<T[P], S>[] } = {};
  const store: Store<S, T> = {
    subscribe(key, cb) {
      const ary = subscribers[key];
      if (ary) {
        ary.push(cb);
      } else {
        const newAry = [cb];
        subscribers[key] = newAry;
      }
    },
    publish(key, value) {
      const reducer = reducers[key];
      const prev = state;
      const result = reducer ? reducer(state, value) : state;
      if (result instanceof Array) {
        const [nextState, nextAction] = result;
        state = nextState;
        subscribers[key]?.forEach((cb) => cb(value, state, prev));
        if (nextAction instanceof Promise) {
          nextAction.then((resolved) =>
            store.publish(resolved.type, resolved.value)
          );
        } else {
          store.publish(nextAction.type, nextAction.value);
        }
      } else {
        state = result;
        subscribers[key]?.forEach((cb) => cb(value, state, prev));
      }
    },
    getState() {
      return state;
    },
  };
  return store;
};
type Actions = Record<string, unknown>;
type Subscriber<A, S> = (action: A, prev: S, cur: S) => void;
type State = Record<string, unknown>;

export interface Store<S, T extends Actions> {
  publish<K extends keyof T>(key: K, value: T[K]): void;
  subscribe<K extends keyof T>(key: K, cb: Subscriber<T[K], S>): void; //FIXME: return unsub function
  getState(): S;
}

type KeyValue<T, K extends keyof T = keyof T> = { type: K; value: T[K] };
export type Reducers<S extends State, T extends Actions> = {
  [P in keyof T]?: (
    prev: S,
    action: T[P]
  ) => S | [S, KeyValue<T> | Promise<KeyValue<T>>];
};
