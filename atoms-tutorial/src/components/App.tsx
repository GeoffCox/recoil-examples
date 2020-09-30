import * as React from "react";
import { ToDoList } from "./ToDoList";
import { RecoilRoot } from "recoil";

export const App = () => {
  return (
    <RecoilRoot>
      <ToDoList />
    </RecoilRoot>
  );
};
