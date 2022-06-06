/// <reference types="react" />
export declare const ComponentAccordion: (props: {
    title: string;
    expanded?: boolean | undefined;
    Content: () => JSX.Element;
    Actions?: (() => JSX.Element) | undefined;
    Settings?: (() => JSX.Element) | undefined;
    ContextProvider?: ((props: any) => JSX.Element) | undefined;
}) => JSX.Element;
