export type ToDoItem = {
    readonly id: number;
    readonly text: string;
    readonly isComplete: boolean;
};

export type ToDoFilter = 'Show Completed' | 'Show Uncompleted' | 'Show All';