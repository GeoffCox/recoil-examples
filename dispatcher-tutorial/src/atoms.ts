import { atom } from "recoil";
import { TodoItem, TodoFilter } from "./types";
import { Dispatcher } from "./dispatcher";

export const todoListState = atom<TodoItem[]>({
  key: "todoListState",
  default: [],
});

export const todoListFilterState = atom<TodoFilter>({
  key: "todoListFilterState",
  default: 'Show All',
});

export const toDoRecycleBinState = atom<TodoItem[]>({
  key: "toDoRecycleBinState",
  default: [],
});


export const logEntryListState = atom<string[]>({
  key: "logEntryListState",
  default: [],
});

export const dispatcherState = atom<Dispatcher | undefined>({
  key: "dispatcherState",
  default: undefined,
});
