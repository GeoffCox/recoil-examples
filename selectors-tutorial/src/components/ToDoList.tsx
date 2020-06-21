import * as React from "react";
import { useRecoilValue } from "recoil";
import { filteredTodoListState } from "../selectors";
import { TodoItemCreator } from "./ToDoItemCreator";
import { TodoListItem } from "./ToDoListItem";
import { TodoListStats } from "./ToDoListStats";
import { TodoListFilters } from "./ToDoListFilters";

export const ToDoList = () => {
    const todoList = useRecoilValue(filteredTodoListState);

    return (
        <>
          <TodoListStats />
          <TodoListFilters />
          <TodoItemCreator />
    
          {todoList.map((todoItem) => (
            <TodoListItem key={todoItem.id} item={todoItem} />
          ))}
        </>
      );
};
