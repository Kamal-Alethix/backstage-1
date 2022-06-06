import { ReactNode } from 'react';
import { AppComponents } from '@backstage/core-plugin-api';
export declare function OptionallyWrapInRouter({ children }: {
    children: ReactNode;
}): JSX.Element;
/**
 * Creates a set of default components to pass along to {@link @backstage/core-app-api#createSpecializedApp}.
 *
 * @public
 */
export declare const components: AppComponents;
