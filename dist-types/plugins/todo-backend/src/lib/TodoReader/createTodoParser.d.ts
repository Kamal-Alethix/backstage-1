import { TodoParser } from './types';
/** @public */
export declare type TodoParserOptions = {
    /** Custom tags to support in addition to TODO and FIXME */
    additionalTags?: string[];
};
/** @public */
export declare function createTodoParser(options?: TodoParserOptions): TodoParser;
