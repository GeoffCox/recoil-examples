# Recoil Dispatcher Tutorial

This example is the ToDo list application demonstrates how to create a dispatcher using Recoil.

- This example demonstrates the use of atom() and useRecoilCallback() to create a dispatcher.
- This example is based on selectors-example.
- Like the previous example project, the code is written in Typescript.
- I've tried to follow the tone and concise language of the Recoil tutorial documentation.

## Intro

Recoil provides great state management hooks so why would anyone want or need the dispatcher pattern?

The dispatcher pattern allows for UI components to invoke state update logic shared across the application. It is a common pattern in other state management libraries for React. Many applications centralize or share state management updates under various names (e.g. dispatcher, pub/sub event bus, handlers).

While the useRecoilState() hook provides state management within React components, it can cause duplicate update code in medium to large applications. The dispatcher pattern helps separate concerns; the React component is concerned with rendering current state, and the dispatcher with updating state.

Consider the dispatcher pattern when you have the same action taken from multiple places in your UI and the logic of the action is complex enough to avoid duplicating it in several places.

## About the tutorial

This tutorial updates To Do list application to recycle bin delete of ToDo items. While this feature could be added without a dispatcher, the dispatcher is used here to demonstrate coordinating state updates between atoms.

Our app will be able to do these additional actions:

- Delete a To Do item that puts the To Do item into the recycle bin
- List the items in the recycle bin
- Recover an item from the recycle bin
- Empty the recycle bin
- We will log every action taken on a To Do List item and display the log.

**To run this example**

1. Install dependencies and build

```
npm install
npm run build
```

2. Open dist/index.html in a browser -or- in VSCode launch the debug task.

## Implementing the dispatcher

### Creating the dispatcher

Recoil provides a critically valuable hook used when atoms need to be updated outside the immediate context of a React component. This is most commonly used to support UI control event handlers like button onClick(). See https://recoiljs.org/docs/api-reference/core/useRecoilCallback for more information about this hook.

First, we'll add an atom for log entries.

```typescript
//atoms.ts
export const logEntryListState = atom<string[]>({
  key: "logEntryListState",
  default: [],
});
```

The useRecoilCallback hook can be used to create a dispatcher. We'll add a factory function that returns a dispatcher. We only add the logMessage function for now.

```typescript
//dispatcher.ts
export const createDispatcher = () => {
  const logMessage = useRecoilCallback<[string], void>(
    ({ set }) => (message: string) => {
      console.log(`${message}`);
      set(logEntryListState, (logEntries) => [...logEntries, message]);
    }
  );
return {
    logMessage
  };
};

export type Dispatcher = ReturnType<typeof createDispatcher>;
```

Notice that the set function's second parameter is an update function. This ensures that each time logEntries is updated, it has the latest list. If we passed the new array as a value instead of the function, repeated calls to logMessage would lose the previous log entry.

### Storing the dispatcher

To allow components to access the dispatcher, we'll put it into an atom. The atom typically stores data, but here we are treating functions as data. A tenet of functional programming is functions are first-class citizens. They can be passed as parameters or referenced as state.

```typescript
//atoms.ts
export const dispatcherState = atom<Dispatcher | undefined>({
  key: "dispatcherState",
  default: undefined,
});
```

Other state management libraries provide a dispatch method that takes a verb string and an args param. There can be extra ceremonial code to route the verb to the right method and pack/unpack the arguments parameter. A benefit of this dispatcher approach in Recoil is functions are directly callable with parameters.

### Initializing the dispatcher

You might notice that we didn't call createDispatcher() to initialize the default. This is because recoil hooks cannot be used during default initialization. 

Each of these approaches returns the same error:
- call createDispatcher directly, 
- wrapping createDispatcher in a Promise.resolve
- wrapping createDispatcher within a useRecoilCallback
- wrapping createDispatcher within a useRecoilCallback and then the callback within a Promise.resolve

```
Invariant Violation: Invalid hook call. Hooks can only be called inside of the body of a function component.
```

We'll initialize the dispatcher using React.useEffect(). Passing the empty dependency array to useEffect sets the dispatcher when the component is mounted. Creating the dispatcher within React.useRef ensures only a single instance is created even if the component is remounted.

```tsx
//ToDoList.tsx
const setDispatcher = useSetRecoilState(dispatcherState);

const dispatcherRef = React.useRef<Dispatcher>(createDispatcher());

React.useEffect(() => {
  setDispatcher(dispatcherRef.current);
}, []);
```

### Using the dispatcher

The dispatcher can be accessed like any other atom.

```tsx
const dispatcher = useRecoilValue(dispatcherState);

dispatcher?.logMessage('Something happened');
```

### Displaying log entries

We'll create a component to display log entries and add it to the ToDoList component.

```tsx
//Log.tsx
export const Log = () => {
    const logEntries = useRecoilValue(logEntryListState);
    
    return (
        <>
          {logEntries.map((entry, index) => (
              <div key={index}>
              <span>{entry}</span>              
            </div>            
          ))}
        </>
      );
};
```

```tsx
//ToDoList.tsx
export const ToDoList = () => {
    //...

    <hr/>
    <Log />

    //...
};
```


## Implementing the recycle bin feature

Now that we have a basic dispatcher initialized and ready to use, we can add recycle bin behavior.

Add an atom to store the list of To Do items in the recycle bin.

```typescript
//atoms.ts
export const toDoRecycleBinState = atom<ToDoItem[]>({
  key: "toDoRecycleBinState",
  default: [],
});
```
Next, we'll update the createDispatcher() with the necessary state update callbacks.

```typescript
// dispatcher.ts
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
```
We'll add a component that displays the recycle bin of items. It lets the user restore any item or emptying the recycle bin.

```tsx
//RecycleBinList.tsx
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
```

```tsx
//ToDoList.tsx
export const ToDoList = () => {
    //...

    <hr/>
    <RecycleBinList />

    //...
};
```
We'll update the ToDoItemCreator and TodoListItem components to use the dispatcher. 

Editing the item text or marking items complete could also be put moved to the dispatcher. They are left as-is to demonstrate updating recoil state from within components is compatible with using a dispatcher.

```tsx
//ToDoItemCreator.tsx
export const TodoItemCreator = () => {
  
  //...
  const dispatcher = useRecoilValue(dispatcherState);

  const addItem = () => {
    dispatcher?.addItem(inputValue);
    setInputValue("");
  };

  //...
};
```

```tsx
//ToDoListItem.tsx
export const TodoListItem = (props: Props) => {

  //...
  const dispatcher = useRecoilValue(dispatcherState);
  
  //...

  const deleteItem = () => {
    dispatcher?.deleteItem(index);
  };

  //...
};
```
Now we have a To Do List application where deleting an item sends it to the recycle bin. We can restore items from the recycle bin or empty it to permanently delete items. We also have a log of all our actions.

## Handling large applications

One of the most powerful aspects of the Recoil architecture is atoms are independent of one another. While this tutorial builds a singleton dispatcher, you can have multiple dispatchers.

Large applications may want to group the update methods for independent types into multiple dispatchers. For example, a store front application could have a customers dispatcher, a product inventory dispatcher, and an orders dispatcher.