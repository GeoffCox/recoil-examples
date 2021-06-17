import { useRecoilCallback } from "recoil";
import { logEntryListState, todoListState, toDoRecycleBinState } from "./atoms";
import { getId, removeItemAtIndex } from "./utils";
import { TodoItem } from "./types";

export const createDispatcher = () => {
  const logMessage = useRecoilCallback(({ set }) => (message: string) => {
    console.log(`${message}`);
    set(logEntryListState, (logEntries) => [...logEntries, message]);
  });

  const addItem = useRecoilCallback(({ set }) => (text: string) => {
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
  });

  const deleteItem = useRecoilCallback(
    ({ snapshot, set }) =>
      async (index: number) => {
        let todoList = await snapshot.getPromise(todoListState);

        if (index < 0 || index >= todoList.length) {
          throw new Error("Could not delete item. Index out of bounds.");
        }

        const foundItem = todoList[index];

        if (foundItem) {
          set(todoListState, (oldTodoList: TodoItem[]) => {
            return removeItemAtIndex(oldTodoList, index);
          });

          set(toDoRecycleBinState, (oldRecycleList: TodoItem[]) => {
            return [...oldRecycleList, foundItem];
          });
          logMessage(`Todo: \"${foundItem?.text}\" moved to recycle bin.`);
        }
      }
  );

  const restoreItem = useRecoilCallback(
    ({ snapshot, set }) =>
      async (index: number) => {
        let recycleList = await snapshot.getPromise(toDoRecycleBinState);

        if (index < 0 || index >= recycleList.length) {
          throw new Error("Could not restore item. Index out of bounds.");
        }

        const foundItem = recycleList[index];

        if (foundItem) {
          set(toDoRecycleBinState, (oldRecycleList: TodoItem[]) => {
            return removeItemAtIndex(oldRecycleList, index);
          });

          set(todoListState, (oldTodoList: TodoItem[]) => [
            ...oldTodoList,
            foundItem,
          ]);

          logMessage(`Todo: \"${foundItem.text}\" restored from recycle bin.`);
        }
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
