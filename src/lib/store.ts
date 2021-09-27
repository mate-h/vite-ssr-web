import { createStoreon, StoreonStore } from "storeon";
import { State as S1, Events as E1, module as m1 } from "lib/auth/store";

export type State = S1;
export type Events = E1;

let store: StoreonStore<S1, E1>;
export function createStore() {
  if (store) return store;
  store = createStoreon<S1, E1>([m1]);
  return store;
}

export function useStore() {
  return store;
}