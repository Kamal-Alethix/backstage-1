import React, { ComponentType } from 'react';
declare const _default: {
    title: string;
    component: (props: import("./Link").LinkProps) => JSX.Element;
    decorators: ((Story: ComponentType<{}>) => React.ReactElement<any, string | React.JSXElementConstructor<any>>)[];
};
export default _default;
export declare const Default: () => JSX.Element;
export declare const PassProps: {
    (): JSX.Element;
    story: {
        name: string;
    };
};
