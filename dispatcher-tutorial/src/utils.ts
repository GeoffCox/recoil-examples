let id = 0;
export const getId = () : number => {
  return id++;
};

export const replaceItemAtIndex = <T>(arr : T[], index : number, newValue : T) : T[] => {
  return [...arr.slice(0, index), newValue, ...arr.slice(index + 1)];
};

export const removeItemAtIndex = <T>(arr: T[], index: number) : T[] => {
  return [...arr.slice(0, index), ...arr.slice(index + 1)];
};
