import { ReactNode } from 'react';
/**
 * Props for the {@link FeatureFlagged} component.
 *
 * @public
 */
export declare type FeatureFlaggedProps = {
    children: ReactNode;
} & ({
    with: string;
} | {
    without: string;
});
/**
 * Enables or disables rendering of its children based on the state of a given
 * feature flag.
 *
 * @public
 */
export declare const FeatureFlagged: (props: FeatureFlaggedProps) => JSX.Element;
