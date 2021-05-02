import * as React from "react";
import { useRecoilValue } from "recoil";
import { todoListState } from "../atoms";
import { TodoItemCreator } from "./TodoItemCreator";
import { TodoListItem } from "./TodoListItem";

export const TodoList = () => {
  const todoList = useRecoilValue(todoListState);

  return (
    <>
      {/* <TodoListStats /> */}
      {/* <TodoListFilters /> */}
      <TodoItemCreator />

      {todoList.map((todoItem) => (
        <TodoListItem key={todoItem.id} item={todoItem} />
      ))}
    </>
  );
};
