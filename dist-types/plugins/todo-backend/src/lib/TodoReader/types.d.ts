/** @public */
export declare type TodoItem = {
    /** The contents of the TODO comment */
    text: string;
    /** The tag used, e.g. TODO, FIXME */
    tag: string;
    /** References author, if any */
    author?: string;
    /** URL used to view the file */
    viewUrl?: string;
    /** The line number of the file that the TODO occurs at */
    lineNumber?: number;
    /** The path of the file containing the TODO within the repo */
    repoFilePath?: string;
};
/** @public */
export declare type ReadTodosOptions = {
    /**
     * Base URLs defining the root at which to search for TODOs
     */
    url: string;
};
/** @public */
export declare type ReadTodosResult = {
    /**
     * TODO items found at the given locations
     */
    items: TodoItem[];
};
/** @public */
export interface TodoReader {
    /**
     * Searches for TODO items in code at a given location
     */
    readTodos(options: ReadTodosOptions): Promise<ReadTodosResult>;
}
/** @public */
export declare type TodoParserContext = {
    content: string;
    path: string;
};
/** @public */
export declare type TodoParserResult = {
    text: string;
    tag: string;
    author?: string;
    lineNumber: number;
};
/** @public */
export declare type TodoParser = (ctx: TodoParserContext) => TodoParserResult[];
