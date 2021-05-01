import { useRecoilCallback } from "recoil";
import { logEntryListState, todoListState, toDoRecycleBinState } from "./atoms";
import { getId, removeItemAtIndex } from "./utils";
import { TodoItem } from "./types";

export const createDispatcher = () => {
  const logMessage = useRecoilCallback<[string], void>(
    ({ set }) => (message: string) => {
      console.log(`${message}`);
      set(logEntryListState, (logEntries) => [...logEntries, message]);
    }
  );

  const addItem = useRecoilCallback<[string], void>(
    ({ set }) => (text: string) => {      

      const newTodoItem = {
        id: getId(),
        text,
        isComplete: false,
      };
      set(todoListState, (oldTodoList: TodoItem[]) => [
        ...oldTodoList,
        newTodoItem,
      ]);
      logMessage(`Todo: ${text} added`);
    }
  );

  const deleteItem = useRecoilCallback<[number], void>(
    ({ set }) => (index: number) => {
      set(todoListState, (oldTodoList: TodoItem[]) => {
        if (index < 0 || index >= oldTodoList.length) {
          throw new Error("Could not delete item. Index out of bounds.");
        }

        const foundItem = oldTodoList[index];

        set(toDoRecycleBinState, (oldRecycleList: TodoItem[]) => [
          ...oldRecycleList,
          foundItem,
        ]);

        logMessage(`Todo: \"${foundItem.text}\" moved to recycle bin.`);
        return removeItemAtIndex(oldTodoList, index);
      });
    }
  );

  const restoreItem = useRecoilCallback<[number], void>(
    ({ set }) => (index: number) => {
      set(toDoRecycleBinState, (oldRecycleList: TodoItem[]) => {
        if (index < 0 || index >= oldRecycleList.length) {
          throw new Error("Could not restore item. Index out of bounds.");
        }

        const foundItem = oldRecycleList[index];

        set(todoListState, (oldTodoList: TodoItem[]) => [
          ...oldTodoList,
          foundItem,
        ]);

        logMessage(`Todo: \"${foundItem.text}\" restored from recycle bin.`);
        return removeItemAtIndex(oldRecycleList, index);
      });
    }
  );

  const emptyRecycleBin = useRecoilCallback(({ reset }) => () => {
    reset(toDoRecycleBinState);
    logMessage(`Recycle bin emptied.`);
  });

  return {
    logMessage,
    addItem,
    deleteItem,
    restoreItem,
    emptyRecycleBin,
  };
};

export type Dispatcher = ReturnType<typeof createDispatcher>;
