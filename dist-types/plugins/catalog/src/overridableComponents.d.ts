import { Overrides } from '@material-ui/core/styles/overrides';
import { StyleRules } from '@material-ui/core/styles/withStyles';
import { EntityLinksEmptyStateClassKey } from './components/EntityLinksCard';
import { SystemDiagramCardClassKey } from './components/SystemDiagramCard';
/** @public */
export declare type PluginCatalogComponentsNameToClassKey = {
    PluginCatalogEntityLinksEmptyState: EntityLinksEmptyStateClassKey;
    PluginCatalogSystemDiagramCard: SystemDiagramCardClassKey;
};
/** @public */
export declare type BackstageOverrides = Overrides & {
    [Name in keyof PluginCatalogComponentsNameToClassKey]?: Partial<StyleRules<PluginCatalogComponentsNameToClassKey[Name]>>;
};
