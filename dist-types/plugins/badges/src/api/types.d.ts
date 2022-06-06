import { Entity } from '@backstage/catalog-model';
export declare const badgesApiRef: import("@backstage/core-plugin-api").ApiRef<BadgesApi>;
export declare type BadgeStyle = 'plastic' | 'flat' | 'flat-square' | 'for-the-badge' | 'social';
interface Badge {
    color?: string;
    description?: string;
    kind?: 'entity';
    label: string;
    labelColor?: string;
    link?: string;
    message: string;
    style?: BadgeStyle;
}
export interface BadgeSpec {
    /** Badge id */
    id: string;
    /** Badge data */
    badge: Badge;
    /** The URL to the badge image */
    url: string;
    /** The markdown code to use the badge */
    markdown: string;
}
export interface BadgesApi {
    getEntityBadgeSpecs(entity: Entity): Promise<BadgeSpec[]>;
}
export {};
