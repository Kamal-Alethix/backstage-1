/// <reference types="react" />
export declare const badgesPlugin: import("@backstage/core-plugin-api").BackstagePlugin<{}, {}>;
export declare const EntityBadgesDialog: ({ open, onClose }: {
    open: boolean;
    onClose?: (() => any) | undefined;
}) => JSX.Element;
