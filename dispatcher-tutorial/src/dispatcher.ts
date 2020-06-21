import { useRecoilCallback } from "recoil";
import { logEntryListState, todoListState, toDoRecycleBinState } from "./atoms";
import { getId, removeItemAtIndex } from "./utils";
import { ToDoItem } from "./types";

export const createDispatcher = () => {
  const logMessage = useRecoilCallback<[string], void>(
    ({ set }) => (message: string) => {
      console.log(`${message}`);
      set(logEntryListState, (logEntries) => [...logEntries, message]);
    }
  );

  const addItem = useRecoilCallback<[string], void>(
    ({ set }) => (text: string) => {      

      const newToDoItem = {
        id: getId(),
        text,
        isComplete: false,
      };
      set(todoListState, (oldTodoList: ToDoItem[]) => [
        ...oldTodoList,
        newToDoItem,
      ]);
      logMessage(`ToDo: ${text} added`);
    }
  );

  const deleteItem = useRecoilCallback<[number], void>(
    ({ set }) => (index: number) => {
      set(todoListState, (oldTodoList: ToDoItem[]) => {
        if (index < 0 || index >= oldTodoList.length) {
          throw new Error("Could not delete item. Index out of bounds.");
        }

        const foundItem = oldTodoList[index];

        set(toDoRecycleBinState, (oldRecycleList: ToDoItem[]) => [
          ...oldRecycleList,
          foundItem,
        ]);

        logMessage(`ToDo: \"${foundItem.text}\" moved to recycle bin.`);
        return removeItemAtIndex(oldTodoList, index);
      });
    }
  );

  const restoreItem = useRecoilCallback<[number], void>(
    ({ set }) => (index: number) => {
      set(toDoRecycleBinState, (oldRecycleList: ToDoItem[]) => {
        if (index < 0 || index >= oldRecycleList.length) {
          throw new Error("Could not restore item. Index out of bounds.");
        }

        const foundItem = oldRecycleList[index];

        set(todoListState, (oldTodoList: ToDoItem[]) => [
          ...oldTodoList,
          foundItem,
        ]);

        logMessage(`ToDo: \"${foundItem.text}\" restored from recycle bin.`);
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
