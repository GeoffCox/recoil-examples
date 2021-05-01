import * as React from "react";
import { useRecoilValue } from "recoil";
import { todoListState } from "../atoms";
import { TodoItemCreator } from "./TodoItemCreator2";
import { TodoItem } from "./TodoItem2";

export const TodoList = () => {
  const todoList = useRecoilValue(todoListState);

  return (
    <>
      {/* <TodoListStats /> */}
      {/* <TodoListFilters /> */}
      <TodoItemCreator />

      {todoList.map((todoItem) => (
        <TodoItem key={todoItem.id} item={todoItem} />
      ))}
    </>
  );
};
