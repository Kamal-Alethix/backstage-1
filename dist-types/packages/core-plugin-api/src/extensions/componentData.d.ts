import { ComponentType, ReactNode } from 'react';
/**
 * Stores data related to a component in a global store.
 *
 * @remarks
 *
 * See {@link https://backstage.io/docs/plugins/composability#component-data}.
 *
 * @param component - The component to attach the data to.
 * @param type - The key under which the data will be stored.
 * @param data - Arbitrary value.
 * @public
 */
export declare function attachComponentData<P>(component: ComponentType<P>, type: string, data: unknown): void;
/**
 * Retrieves data attached to a component.
 *
 * @remarks
 *
 * See {@link https://backstage.io/docs/plugins/composability#component-data}.
 *
 * @param node - React component to look up.
 * @param type - Key of the data to retrieve.
 * @returns Data stored using {@link attachComponentData}.
 * @public
 */
export declare function getComponentData<T>(node: ReactNode, type: string): T | undefined;
