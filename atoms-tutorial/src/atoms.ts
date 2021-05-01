import { atom } from "recoil";
import { TodoItem } from "./types";

export const todoListState = atom<TodoItem[]>({
    key: 'todoListState',
    default: [],
  });