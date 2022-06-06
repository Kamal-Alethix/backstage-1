import { Config } from '@backstage/config';
import { Entity } from '@backstage/catalog-model';
import express from 'express';
import { PluginEndpointDiscovery } from '@backstage/backend-common';
import { CatalogApi } from '@backstage/catalog-client';

declare const BADGE_STYLES: readonly ["plastic", "flat", "flat-square", "for-the-badge", "social"];
declare type BadgeStyle = typeof BADGE_STYLES[number];
interface Badge {
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
interface BadgeContext {
    badgeUrl: string;
    config: Config;
    entity?: Entity;
}
interface BadgeFactory {
    createBadge(context: BadgeContext): Badge;
}
interface BadgeFactories {
    [id: string]: BadgeFactory;
}

declare const createDefaultBadgeFactories: () => BadgeFactories;

declare type BadgeInfo = {
    id: string;
};
declare type BadgeOptions = {
    badgeInfo: BadgeInfo;
    context: BadgeContext;
};
declare type BadgeSpec = {
    /** Badge id */
    id: string;
    /** Badge data */
    badge: Badge;
    /** The URL to the badge image */
    url: string;
    /** The markdown code to use the badge */
    markdown: string;
};
declare type BadgeBuilder = {
    getBadges(): Promise<BadgeInfo[]>;
    createBadgeJson(options: BadgeOptions): Promise<BadgeSpec>;
    createBadgeSvg(options: BadgeOptions): Promise<string>;
};

declare class DefaultBadgeBuilder implements BadgeBuilder {
    private readonly factories;
    constructor(factories: BadgeFactories);
    getBadges(): Promise<BadgeInfo[]>;
    createBadgeJson(options: BadgeOptions): Promise<BadgeSpec>;
    createBadgeSvg(options: BadgeOptions): Promise<string>;
    protected getMarkdownCode(params: Badge, badgeUrl: string): string;
}

interface RouterOptions {
    badgeBuilder?: BadgeBuilder;
    badgeFactories?: BadgeFactories;
    catalog?: CatalogApi;
    config: Config;
    discovery: PluginEndpointDiscovery;
}
declare function createRouter(options: RouterOptions): Promise<express.Router>;

export { BADGE_STYLES, Badge, BadgeBuilder, BadgeContext, BadgeFactories, BadgeFactory, BadgeInfo, BadgeOptions, BadgeSpec, BadgeStyle, DefaultBadgeBuilder, RouterOptions, createDefaultBadgeFactories, createRouter };
