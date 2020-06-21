import * as React from "react";
import { useState } from "react";
import { dispatcherState } from "../atoms";
import { useRecoilValue } from "recoil";

export const TodoItemCreator = () => {
  const [inputValue, setInputValue] = useState("");
  const dispatcher = useRecoilValue(dispatcherState);

  const addItem = () => {
    dispatcher?.addItem(inputValue);
    setInputValue("");
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event;
    setInputValue(value);
  };

  return (
    <div>
      <input type="text" value={inputValue} onChange={onChange} />
      <button onClick={addItem}>Add</button>
    </div>
  );
};
