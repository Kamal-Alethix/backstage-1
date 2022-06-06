import type { Transformer } from './transformer';
export declare const rewriteDocLinks: () => Transformer;
/** Make sure that the input url always ends with a '/' */
export declare function normalizeUrl(input: string): string;
