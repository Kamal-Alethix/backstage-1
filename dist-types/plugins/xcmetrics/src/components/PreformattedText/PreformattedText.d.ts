/// <reference types="react" />
interface PreformattedTextProps {
    text: string;
    maxChars: number;
}
interface ExpandableProps extends PreformattedTextProps {
    expandable: boolean;
    title: string;
}
interface NonExpandableProps extends PreformattedTextProps {
    expandable?: never;
    title?: string;
}
export declare const PreformattedText: ({ text, maxChars, expandable, title, }: NonExpandableProps | ExpandableProps) => JSX.Element;
export {};
