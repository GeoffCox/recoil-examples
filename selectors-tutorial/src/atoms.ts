import { atom } from "recoil";
import { TodoItem, TodoFilter } from "./types";

export const todoListState = atom<TodoItem[]>({
  key: "todoListState",
  default: [],
});

export const todoListFilterState = atom<TodoFilter>({
  key: "todoListFilterState",
  default: 'Show All',
});
