import * as React from "react";
import { useRecoilValue } from "recoil";
import { toDoRecycleBinState, dispatcherState } from "../atoms";

export const RecycleBinList = () => {
  const recycleList = useRecoilValue(toDoRecycleBinState);
  const dispatcher = useRecoilValue(dispatcherState);

  const restoreItem = (index: number) => {
    dispatcher?.restoreItem(index);
  };

  const emptyRecycleBin = () => {
    dispatcher?.emptyRecycleBin();
  };

  return (
    <>
      <div>
        <button onClick={emptyRecycleBin}>Empty Recycle Bin</button>
      </div>
      {recycleList.map((todoItem, index) => (
        <div key={todoItem.id}>
          <span>{todoItem.text}</span>
          <button onClick={() => restoreItem(index)}>^</button>
        </div>
      ))}
    </>
  );
};
