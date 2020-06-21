import * as React from "react";
import { useRecoilValue } from "recoil";
import { todoListState } from "../atoms";
import { TodoItemCreator } from "./ToDoItemCreator";
import { TodoListItem } from "./ToDoListItem";

export const ToDoList = () => {
    const todoList = useRecoilValue(todoListState);

    return (
        <>
          <TodoItemCreator />
    
          {todoList.map((todoItem) => (
            <TodoListItem key={todoItem.id} item={todoItem} />
          ))}
        </>
      );
};
