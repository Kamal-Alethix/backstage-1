import { Config } from '@backstage/config';
import { Entity } from '@backstage/catalog-model';
export declare const BADGE_STYLES: readonly ["plastic", "flat", "flat-square", "for-the-badge", "social"];
export declare type BadgeStyle = typeof BADGE_STYLES[number];
export interface Badge {
    /** Badge message background color. */
    color?: string;
    /** Badge description (tooltip text) */
    description?: string;
    /** Kind of badge */
    kind?: 'entity';
    /**
     * Badge label (should be a rather static value)
     * ref. shields spec https://github.com/badges/shields/blob/master/spec/SPECIFICATION.md
     */
    label: string;
    /** Badge label background color */
    labelColor?: string;
    /** Custom badge link */
    link?: string;
    /** Badge message */
    message: string;
    /** Badge style (appearance). One of "plastic", "flat", "flat-square", "for-the-badge" and "social" */
    style?: BadgeStyle;
}
export interface BadgeContext {
    badgeUrl: string;
    config: Config;
    entity?: Entity;
}
export interface BadgeFactory {
    createBadge(context: BadgeContext): Badge;
}
export interface BadgeFactories {
    [id: string]: BadgeFactory;
}
