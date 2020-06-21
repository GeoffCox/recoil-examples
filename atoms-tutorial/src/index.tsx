import * as React from "react";
import * as ReactDOM from "react-dom";
import { App } from "./components/App";

const appElement = document.getElementById("app");

// Creates an application
const createApp = (AppComponent: typeof App) => {
  return <AppComponent />;
};

// Initial rendering of the application
ReactDOM.render(createApp(App), appElement);

// Hot Module Replacement types
interface NodeModule {
  hot: any;
}

declare var module: NodeModule;

interface NodeRequire {
  <T>(path: string): T;
}

declare var require: NodeRequire;

// Whenever the HMR indicates the source has changed,
// a new application is created and swapped with the current one.
if (module.hot) {
  module.hot.accept("./components/App", () => {
    console.log("hot module reload");
    const NextApp = require<{ App: typeof App }>("./components/App").App;
    ReactDOM.render(createApp(NextApp), appElement);
  });
}
