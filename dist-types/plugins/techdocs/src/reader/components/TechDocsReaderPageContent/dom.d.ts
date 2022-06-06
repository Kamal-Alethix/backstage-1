import { CompoundEntityRef } from '@backstage/catalog-model';
/**
 * Hook that encapsulates the behavior of getting raw HTML and applying
 * transforms to it in order to make it function at a basic level in the
 * Backstage UI.
 */
export declare const useTechDocsReaderDom: (entityRef: CompoundEntityRef) => Element | null;
