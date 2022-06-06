import type { Transformer } from '../reader/transformers';
export declare type CreateTestShadowDomOptions = {
    preTransformers: Transformer[];
    postTransformers: Transformer[];
};
export declare const createTestShadowDom: (fixture: string, opts?: CreateTestShadowDomOptions) => Promise<ShadowRoot>;
export declare const getSample: (shadowDom: ShadowRoot, elementName: string, elementAttribute: string, sampleSize?: number) => (string | null)[];
