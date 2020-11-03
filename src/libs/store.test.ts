import { createStore } from "./store";

test("test1", () => {
  const store = createStore<
    { num: number },
    {
      ADD: number;
      ADD_TWICE: number;
    }
  >(
    {
      ADD: (prev, action) => ({ num: prev.num + action }),
      ADD_TWICE: (prev, action) => [
        { num: prev.num + action },
        { type: "ADD", value: action },
      ],
    },
    { num: 0 }
  );
  const sub_ADD = jest.fn();
  store.subscribe("ADD", sub_ADD);
  const sub_ADD_TWICE = jest.fn();
  store.subscribe("ADD_TWICE", sub_ADD_TWICE);
  store.publish("ADD", 1);
  expect(store.getState()).toEqual({ num: 1 });
  store.publish("ADD_TWICE", 1);
  expect(store.getState()).toEqual({ num: 3 });
});
test("test2", (cb) => {
  const store = createStore<
    { num: number },
    {
      ADD: number;
      ADD_LATER: number;
    }
  >(
    {
      ADD: (prev, action) => ({ num: prev.num + action }),
      ADD_LATER: (prev, action) => [
        prev,
        Promise.resolve({ type: "ADD", value: action }),
      ],
    },
    { num: 0 }
  );
  const sub_ADD = jest.fn();
  store.subscribe("ADD", sub_ADD);
  const sub_ADD_TWICE = jest.fn();
  store.subscribe("ADD_LATER", sub_ADD_TWICE);
  store.subscribe("ADD", (_, state) => {
    expect(state).toEqual({ num: 1 });
    cb();
  });
  store.publish("ADD_LATER", 1);
});
