import React from 'react';
import { Extension } from '@backstage/core-plugin-api';
import { TechDocsAddonLocations, TechDocsAddonOptions } from './types';
export declare const TECHDOCS_ADDONS_KEY = "techdocs.addons.addon.v1";
/**
 * Marks the <TechDocsAddons> registry component.
 * @public
 */
export declare const TECHDOCS_ADDONS_WRAPPER_KEY = "techdocs.addons.wrapper.v1";
/**
 * TechDocs Addon registry.
 * @public
 */
export declare const TechDocsAddons: React.ComponentType;
/**
 * Create a TechDocs addon overload signature without props.
 * @public
 */
export declare function createTechDocsAddonExtension(options: TechDocsAddonOptions): Extension<() => JSX.Element | null>;
/**
 * Create a TechDocs addon overload signature with props.
 * @public
 */
export declare function createTechDocsAddonExtension<TComponentProps>(options: TechDocsAddonOptions<TComponentProps>): Extension<(props: TComponentProps) => JSX.Element | null>;
/**
 * hook to use addons in components
 * @public
 */
export declare const useTechDocsAddons: () => {
    renderComponentByName: (name: string) => JSX.Element | null;
    renderComponentsByLocation: (location: keyof typeof TechDocsAddonLocations) => (JSX.Element | null)[] | null;
};
