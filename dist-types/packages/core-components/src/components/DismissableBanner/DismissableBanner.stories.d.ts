/// <reference types="react" />
import { Props } from './DismissableBanner';
declare const _default: {
    title: string;
    component: (props: Props) => JSX.Element;
    argTypes: {
        variant: {
            options: string[];
            control: {
                type: string;
            };
        };
    };
};
export default _default;
export declare const Default: {
    (args: Props): JSX.Element;
    args: {
        message: string;
        variant: string;
        fixed: boolean;
    };
};
export declare const WithLink: {
    (args: Props): JSX.Element;
    args: {
        message: string;
        variant: string;
        fixed: boolean;
    };
};
