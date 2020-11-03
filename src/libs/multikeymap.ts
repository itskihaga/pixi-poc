class Container<T> {
  constructor(public value: T) {}
}
interface MultiKeyMap<K extends Array<unknown>, V> {
  set(keys: K, value: V): void;
  get(keys: K): V | undefined;
}
export const createMultiKeyMap = <K extends Array<unknown>, V>(): MultiKeyMap<
  K,
  V
> => {
  const map = new Map<unknown, MapOrContainer>();
  type MapOrContainer = Container<V> | Map<unknown, MapOrContainer>;
  return {
    set(keys: K, value: V) {
      interface Acc {
        map: Map<unknown, MapOrContainer>;
        setMap?: () => void;
        setValue?: () => void;
      }
      const acc = keys.reduce<Acc>(
        (acc, cur): Acc => {
          const res = acc.map.get(cur);
          if (res instanceof Container) {
            //FIXME: allow rewrite
            throw new Error("Do not rewrite!!");
          }
          if (res instanceof Map) {
            return {
              map: res,
              setMap() {
                acc.setMap && acc.setMap();
              },
            };
          }
          const newMap = new Map<unknown, MapOrContainer>();
          return {
            map: newMap,
            setMap() {
              acc.setMap && acc.setMap();
              acc.map.set(cur, newMap);
            },
            setValue() {
              acc.setMap && acc.setMap();
              acc.map.set(cur, new Container(value));
            },
          };
        },
        { map }
      );
      if (acc.setValue) {
        acc.setValue();
      } else {
        throw new Error("Do not rewrite!!");
      }
    },
    get(keys: K): V | undefined {
      const res = keys.reduce<MapOrContainer | undefined>((acc, cur) => {
        if (acc instanceof Map) {
          return acc.get(cur);
        }
        if (acc instanceof Container) {
          throw new Error("Faild");
        }
        return undefined;
      }, map);
      if (res instanceof Map) {
        throw new Error("Faild");
      }
      if (res instanceof Container) {
        return res.value;
      }
    },
  };
};
