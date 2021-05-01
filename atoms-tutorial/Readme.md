# Recoil Atoms Tutorial

This example is the Todo list application described in the atoms tutorial: https://recoiljs.org/docs/basic-tutorial/atoms. 

- This example demonstrates the use of atom(), useRecoilValue(), and useRecoilState().

- This code updated to use Typescript:
  - Defined the TodoItem type
  - Renamed TodoItem to TodoListItem to avoid conflict with the newly defined TodoItem type.
  - Moved the utility functions to a utils.ts module
  - Updated functions to the lambda form
  - Updated event handlers to use event types

**To run this example**

1. Install dependencies and build
```
npm install
npm run build
```

2. Open dist/index.html in a browser -or- in VSCode launch the debug task.


