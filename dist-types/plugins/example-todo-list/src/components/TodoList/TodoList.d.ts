/// <reference types="react" />
export declare type Todo = {
    title: string;
    id: string;
    author?: string;
    timestamp: number;
};
declare type TodosTableProps = {
    todos: Todo[];
    onEdit(todo: Todo): any;
};
export declare const TodoList: ({ onEdit }: {
    onEdit(todo: Todo): any;
}) => JSX.Element;
export declare function TodosTable({ todos, onEdit }: TodosTableProps): JSX.Element;
export {};
