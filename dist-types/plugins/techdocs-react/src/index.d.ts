/**
 * Package encapsulating utilities to be shared by frontend TechDocs plugins.
 *
 * @packageDocumentation
 */
export { useTechDocsAddons, createTechDocsAddonExtension, TechDocsAddons, TECHDOCS_ADDONS_WRAPPER_KEY, } from './addons';
export { techdocsApiRef, techdocsStorageApiRef } from './api';
export type { SyncResult, TechDocsApi, TechDocsStorageApi } from './api';
export { TechDocsReaderPageProvider, useTechDocsReaderPage } from './context';
export type { TechDocsReaderPageProviderProps, TechDocsReaderPageProviderRenderFunction, TechDocsReaderPageValue, } from './context';
export { TechDocsAddonLocations } from './types';
export type { TechDocsEntityMetadata, TechDocsMetadata, TechDocsAddonOptions, } from './types';
export type { TechDocsShadowDomProps } from './component';
export { TechDocsShadowDom, useShadowDomStylesLoading, SHADOW_DOM_STYLE_LOAD_EVENT, } from './component';
export { useShadowRoot, useShadowRootElements, useShadowRootSelection, } from './hooks';
