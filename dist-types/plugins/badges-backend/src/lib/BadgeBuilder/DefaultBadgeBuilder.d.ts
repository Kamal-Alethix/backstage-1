import { BadgeBuilder, BadgeInfo, BadgeOptions, BadgeSpec } from './types';
import { Badge, BadgeFactories } from '../../types';
export declare class DefaultBadgeBuilder implements BadgeBuilder {
    private readonly factories;
    constructor(factories: BadgeFactories);
    getBadges(): Promise<BadgeInfo[]>;
    createBadgeJson(options: BadgeOptions): Promise<BadgeSpec>;
    createBadgeSvg(options: BadgeOptions): Promise<string>;
    protected getMarkdownCode(params: Badge, badgeUrl: string): string;
}
