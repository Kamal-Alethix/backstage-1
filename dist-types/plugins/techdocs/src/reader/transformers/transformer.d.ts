export declare type Transformer = (dom: Element) => Element | Promise<Element>;
export declare const transform: (html: string | Element, transformers: Transformer[]) => Promise<Element>;
