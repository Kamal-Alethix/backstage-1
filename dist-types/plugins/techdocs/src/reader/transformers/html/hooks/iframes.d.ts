/**
 * Returns a function that removes unsafe iframe nodes.
 * @param node - can be any element.
 * @param hosts - list of allowed hosts.
 */
export declare const removeUnsafeIframes: (hosts: string[]) => (node: Element) => Element;
