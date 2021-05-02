import * as React from "react";
import { useRecoilValue } from "recoil";
import { filteredTodoListState } from "../selectors";
import { TodoItemCreator } from "./TodoItemCreator";
import { TodoListItem } from "./TodoListItem";
import { TodoListStats } from "./TodoListStats";
import { TodoListFilters } from "./TodoListFilters";

export const TodoList = () => {
    // changed from todoListState to filteredTodoListState
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
