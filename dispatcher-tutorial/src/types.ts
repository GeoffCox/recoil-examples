export type TodoItem = {
    readonly id: number;
    readonly text: string;
    readonly isComplete: boolean;
};

export type TodoFilter = 'Show Completed' | 'Show Uncompleted' | 'Show All';