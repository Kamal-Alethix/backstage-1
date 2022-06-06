import { ReactElement } from 'react';
import { RenderOptions, RenderResult } from '@testing-library/react';
/**
 * @public
 * Simplifies rendering of async components in by taking care of the wrapping inside act
 *
 * @remarks
 *
 * Components using useEffect to perform an asynchronous action (such as fetch) must be rendered within an async
 * act call to properly get the final state, even with mocked responses. This utility method makes the signature a bit
 * cleaner, since act doesn't return the result of the evaluated function.
 * https://github.com/testing-library/react-testing-library/issues/281
 * https://github.com/facebook/react/pull/14853
 */
export declare function renderWithEffects(nodes: ReactElement, options?: Pick<RenderOptions, 'wrapper'>): Promise<RenderResult>;
