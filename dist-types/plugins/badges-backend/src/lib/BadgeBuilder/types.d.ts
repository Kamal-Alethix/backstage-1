import { Badge, BadgeContext } from '../../types';
export declare type BadgeInfo = {
    id: string;
};
export declare type BadgeOptions = {
    badgeInfo: BadgeInfo;
    context: BadgeContext;
};
export declare type BadgeSpec = {
    /** Badge id */
    id: string;
    /** Badge data */
    badge: Badge;
    /** The URL to the badge image */
    url: string;
    /** The markdown code to use the badge */
    markdown: string;
};
export declare type BadgeBuilder = {
    getBadges(): Promise<BadgeInfo[]>;
    createBadgeJson(options: BadgeOptions): Promise<BadgeSpec>;
    createBadgeSvg(options: BadgeOptions): Promise<string>;
};
