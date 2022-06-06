import React, { PropsWithChildren } from 'react';
import { ApiRef, ApiHolder, TypesToApiRefs } from './types';
/**
 * React hook for retrieving {@link ApiHolder}, an API catalog.
 *
 * @public
 */
export declare function useApiHolder(): ApiHolder;
/**
 * React hook for retrieving APIs.
 *
 * @param apiRef - Reference of the API to use.
 * @public
 */
export declare function useApi<T>(apiRef: ApiRef<T>): T;
/**
 * Wrapper for giving component an API context.
 *
 * @param apis - APIs for the context.
 * @public
 */
export declare function withApis<T>(apis: TypesToApiRefs<T>): <P extends T>(WrappedComponent: React.ComponentType<P>) => {
    (props: React.PropsWithChildren<Omit<P, keyof T>>): JSX.Element;
    displayName: string;
};
