import * as React from "react";
import { TodoList } from "./TodoList2";
import { RecoilRoot } from "recoil";

export const App = () => {
  return (
    <RecoilRoot>
      <TodoList />
    </RecoilRoot>
  );
};
