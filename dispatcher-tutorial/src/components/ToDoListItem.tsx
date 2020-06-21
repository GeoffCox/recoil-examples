import * as React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { ToDoItem } from "../types";
import { todoListState, dispatcherState } from "../atoms";
import { replaceItemAtIndex } from "../utils";

type Props = {
  item: ToDoItem;
};

export const TodoListItem = (props: Props) => {
  const { item } = props;

  const [todoList, setTodoList] = useRecoilState(todoListState);
  const dispatcher = useRecoilValue(dispatcherState);
  
  const index = todoList.findIndex((listItem) => listItem === item);

  const editItemText = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event;
    const newList = replaceItemAtIndex(todoList, index, {
      ...item,
      text: value,
    });

    setTodoList(newList);
  };

  const toggleItemCompletion = () => {
    const newList = replaceItemAtIndex(todoList, index, {
      ...item,
      isComplete: !item.isComplete,
    });

    setTodoList(newList);
  };

  const deleteItem = () => {
    dispatcher?.deleteItem(index);
  };

  return (
    <div>
      <input type="text" value={item.text} onChange={editItemText} />
      <input
        type="checkbox"
        checked={item.isComplete}
        onChange={toggleItemCompletion}
      />
      <button onClick={deleteItem}>X</button>
    </div>
  );
};
