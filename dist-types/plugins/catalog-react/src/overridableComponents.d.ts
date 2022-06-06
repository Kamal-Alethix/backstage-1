import { Overrides } from '@material-ui/core/styles/overrides';
import { StyleRules } from '@material-ui/core/styles/withStyles';
import { CatalogReactUserListPickerClassKey, CatalogReactEntityLifecyclePickerClassKey, CatalogReactEntitySearchBarClassKey, CatalogReactEntityTagPickerClassKey, CatalogReactEntityOwnerPickerClassKey } from './components';
/** @public */
export declare type CatalogReactComponentsNameToClassKey = {
    CatalogReactUserListPicker: CatalogReactUserListPickerClassKey;
    CatalogReactEntityLifecyclePicker: CatalogReactEntityLifecyclePickerClassKey;
    CatalogReactEntitySearchBar: CatalogReactEntitySearchBarClassKey;
    CatalogReactEntityTagPicker: CatalogReactEntityTagPickerClassKey;
    CatalogReactEntityOwnerPicker: CatalogReactEntityOwnerPickerClassKey;
};
/** @public */
export declare type BackstageOverrides = Overrides & {
    [Name in keyof CatalogReactComponentsNameToClassKey]?: Partial<StyleRules<CatalogReactComponentsNameToClassKey[Name]>>;
};
