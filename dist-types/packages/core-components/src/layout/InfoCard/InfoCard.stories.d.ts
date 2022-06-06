/// <reference types="react" />
import { InfoCard, Props } from './InfoCard';
declare const _default: {
    title: string;
    component: typeof InfoCard;
};
export default _default;
export declare const Default: {
    (args: Props): JSX.Element;
    args: {
        title: string;
        subheader: string;
    };
};
export declare const LinkInFooter: {
    (args: Props): JSX.Element;
    args: {
        deepLink: {
            title: string;
            link: string;
        };
        title: string;
        subheader: string;
    };
};
