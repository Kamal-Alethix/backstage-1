/// <reference types="react" />
export declare const rootRouteRef: import("@backstage/core-plugin-api").RouteRef<undefined>;
export declare const splunkOnCallPlugin: import("@backstage/core-plugin-api").BackstagePlugin<{
    root: import("@backstage/core-plugin-api").RouteRef<undefined>;
}, {}>;
export declare const SplunkOnCallPage: {
    ({ title, subtitle, pageTitle, }: import("./components/SplunkOnCallPage").SplunkOnCallPageProps): JSX.Element;
    defaultProps: {
        title: string;
        subtitle: string;
        pageTitle: string;
    };
};
export declare const EntitySplunkOnCallCard: (props: import("./components/EntitySplunkOnCallCard").EntitySplunkOnCallCardProps) => JSX.Element;
