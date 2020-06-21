import { atom } from "recoil";
import { ToDoItem } from "./types";

export const todoListState = atom<ToDoItem[]>({
    key: 'todoListState',
    default: [],
  });