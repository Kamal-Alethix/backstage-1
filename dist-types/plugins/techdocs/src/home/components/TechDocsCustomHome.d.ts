/// <reference types="react" />
import { CSSProperties } from '@material-ui/styles';
import { Entity } from '@backstage/catalog-model';
/**
 * Available panel types
 *
 * @public
 */
export declare type PanelType = 'DocsCardGrid' | 'DocsTable';
/**
 * Type representing a TechDocsCustomHome panel.
 *
 * @public
 */
export interface PanelConfig {
    title: string;
    description: string;
    panelType: PanelType;
    panelCSS?: CSSProperties;
    filterPredicate: ((entity: Entity) => boolean) | string;
}
/**
 * Type representing a TechDocsCustomHome tab.
 *
 * @public
 */
export interface TabConfig {
    label: string;
    panels: PanelConfig[];
}
/**
 * Type representing a list of TechDocsCustomHome tabs.
 *
 * @public
 */
export declare type TabsConfig = TabConfig[];
/**
 * Props for {@link TechDocsCustomHome}
 *
 * @public
 */
export declare type TechDocsCustomHomeProps = {
    tabsConfig: TabsConfig;
};
export declare const TechDocsCustomHome: (props: TechDocsCustomHomeProps) => JSX.Element;
