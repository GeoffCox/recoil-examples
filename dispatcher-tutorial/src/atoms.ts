import { atom } from "recoil";
import { ToDoItem, ToDoFilter } from "./types";
import { Dispatcher } from "./dispatcher";

export const todoListState = atom<ToDoItem[]>({
  key: "todoListState",
  default: [],
});

export const todoListFilterState = atom<ToDoFilter>({
  key: "todoListFilterState",
  default: 'Show All',
});

export const toDoRecycleBinState = atom<ToDoItem[]>({
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
