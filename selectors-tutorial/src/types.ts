export type ToDoItem = {
    id: number;
    text: string;
    isComplete: boolean;
};

export type ToDoFilter = 'Show Completed' | 'Show Uncompleted' | 'Show All';