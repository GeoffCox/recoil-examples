import { atom } from "recoil";
import { ToDoItem, ToDoFilter } from "./types";

export const todoListState = atom<ToDoItem[]>({
  key: "todoListState",
  default: [],
});

export const todoListFilterState = atom<ToDoFilter>({
  key: "todoListFilterState",
  default: 'Show All',
});
