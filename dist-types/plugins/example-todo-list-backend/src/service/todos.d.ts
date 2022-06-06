export declare type Todo = {
    title: string;
    author?: string;
    id: string;
    timestamp: number;
};
export declare type TodoFilter = {
    property: Exclude<keyof Todo, 'timestamp'>;
    values: Array<string | undefined>;
};
export declare type TodoFilters = {
    anyOf: TodoFilters[];
} | {
    allOf: TodoFilters[];
} | {
    not: TodoFilters;
} | TodoFilter;
export declare function add(todo: Omit<Todo, 'id' | 'timestamp'>): Todo;
export declare function getTodo(id: string): Todo;
export declare function update({ id, title }: {
    id: string;
    title: string;
}): Todo;
export declare function getAll(filter?: TodoFilters): Todo[];
