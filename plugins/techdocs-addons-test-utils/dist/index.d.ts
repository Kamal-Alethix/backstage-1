import React, { ReactElement } from 'react';
import { screen } from 'testing-library__dom';
import { ApiRef } from '@backstage/core-plugin-api';
import { TechDocsMetadata, TechDocsEntityMetadata } from '@backstage/plugin-techdocs-react';

/** @ignore */
declare type TechDocsAddonTesterTestApiPair<TApi> = TApi extends infer TImpl ? readonly [ApiRef<TApi>, Partial<TImpl>] : never;
/** @ignore */
declare type TechdocsAddonTesterApis<TApiPairs> = {
    [TIndex in keyof TApiPairs]: TechDocsAddonTesterTestApiPair<TApiPairs[TIndex]>;
};
/**
 * Utility class for rendering TechDocs Addons end-to-end within the TechDocs
 * reader page, with a set of givens (e.g. page DOM, metadata, etc).
 *
 * @example
 * ```tsx
 * const { getByText } = await TechDocsAddonTester.buildAddonsInTechDocs([<AnAddon />])
 *   .withDom(<body>TEST_CONTENT</body>)
 *   .renderWithEffects();
 *
 * expect(getByText('TEST_CONTENT')).toBeInTheDocument();
 * ```
 *
 * @public
 */
declare class TechDocsAddonTester {
    private options;
    private addons;
    /**
     * Get a TechDocsAddonTester instance for a given set of Addons.
     */
    static buildAddonsInTechDocs(addons: ReactElement[]): TechDocsAddonTester;
    protected constructor(addons: ReactElement[]);
    /**
     * Provide mock API implementations if your Addon expects any.
     */
    withApis<T extends any[]>(apis: TechdocsAddonTesterApis<T>): this;
    /**
     * Provide mock HTML if your Addon expects it in the shadow DOM.
     */
    withDom(dom: ReactElement): this;
    /**
     * Provide mock techdocs_metadata.json values if your Addon needs it.
     */
    withMetadata(metadata: Partial<TechDocsMetadata>): this;
    /**
     * Provide a mock entity if your Addon needs it. This also controls the base
     * path at which the Addon is rendered.
     */
    withEntity(entity: Partial<TechDocsEntityMetadata>): this;
    /**
     * Provide the TechDocs page path at which the Addon is rendered (e.g. the
     * part of the path after the entity namespace/kind/name).
     */
    atPath(path: string): this;
    /**
     * Return a fully configured and mocked TechDocs reader page within a test
     * App instance, using the given Addon(s).
     */
    build(): React.ReactElement<any, string | React.JSXElementConstructor<any>>;
    /**
     * Render the Addon within a fully configured and mocked TechDocs reader.
     *
     * @remarks
     * Components using useEffect to perform an asynchronous action (such as
     * fetch) must be rendered within an async act call to properly get the final
     * state, even with mocked responses. This utility method makes the signature
     * a bit cleaner, since act doesn't return the result of the evaluated
     * function.
     *
     * @see https://github.com/testing-library/react-testing-library/issues/281
     * @see https://github.com/facebook/react/pull/14853
     */
    renderWithEffects(): Promise<typeof screen & {
        shadowRoot: ShadowRoot | null;
    }>;
}

export { TechDocsAddonTester };
