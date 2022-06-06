import { ReactNode } from 'react';
import { AnalyticsContextValue } from './types';
/**
 * Provides components in the child react tree an Analytics Context, ensuring
 * all analytics events captured within the context have relevant attributes.
 *
 * @remarks
 *
 * Analytics contexts are additive, meaning the context ultimately emitted with
 * an event is the combination of all contexts in the parent tree.
 *
 * @alpha
 */
export declare const AnalyticsContext: (options: {
    attributes: Partial<AnalyticsContextValue>;
    children: ReactNode;
}) => JSX.Element;
