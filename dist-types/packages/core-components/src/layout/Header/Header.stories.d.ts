/// <reference types="react" />
import { Header } from './Header';
declare const _default: {
    title: string;
    component: typeof Header;
    argTypes: {
        type: {
            options: string[];
            control: {
                type: string;
            };
        };
    };
};
export default _default;
export declare const Default: {
    (args: {
        type: string;
        title: string;
        subtitle: string;
    }): JSX.Element;
    args: {
        type: string;
        title: string;
        subtitle: string;
    };
};
