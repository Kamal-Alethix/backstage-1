/// <reference types="react" />
export declare type SplunkOnCallPageProps = {
    title?: string;
    subtitle?: string;
    pageTitle?: string;
};
export declare const SplunkOnCallPage: {
    ({ title, subtitle, pageTitle, }: SplunkOnCallPageProps): JSX.Element;
    defaultProps: {
        title: string;
        subtitle: string;
        pageTitle: string;
    };
};
