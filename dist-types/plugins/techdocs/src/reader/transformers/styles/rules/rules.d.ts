/**
 * A list of style rules that will be applied to an element in the order they were added.
 *
 * @remarks
 * The order of items is important, which means that a rule can override any other rule previously added to the list,
 * i.e. the rules will be applied from the first added to the last added.
 */
export declare const rules: (({ theme }: import("./types").RuleOptions) => string)[];
