import * as React from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { filteredTodoListState } from "../selectors";
import { TodoItemCreator } from "./TodoItemCreator";
import { TodoListItem } from "./TodoListItem";
import { TodoListStats } from "./TodoListStats";
import { TodoListFilters } from "./TodoListFilters";
import { RecycleBinList } from "./RecycleBinList";
import { createDispatcher, Dispatcher } from "../dispatcher";
import { dispatcherState } from "../atoms";
import { Log } from "./Log";

export const TodoList = () => {
    const todoList = useRecoilValue(filteredTodoListState);
    const setDispatcher = useSetRecoilState(dispatcherState);

    const dispatcherRef = React.useRef<Dispatcher>(createDispatcher());
    React.useEffect(() => {
      setDispatcher(dispatcherRef.current);
    }, []);

    return (
        <>
          <TodoListStats />
          <TodoListFilters />
          <TodoItemCreator />
    
          {todoList.map((todoItem) => (
            <TodoListItem key={todoItem.id} item={todoItem} />
          ))}

          <hr/>
          <RecycleBinList />

          <hr/>
          <Log />
        </>
      );
};
