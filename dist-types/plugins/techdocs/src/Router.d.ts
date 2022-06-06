import { PropsWithChildren } from 'react';
import { Entity } from '@backstage/catalog-model';
/**
 * Helper that takes in entity and returns true/false if TechDocs is available for the entity
 *
 * @public
 */
export declare const isTechDocsAvailable: (entity: Entity) => boolean;
/**
 * Responsible for registering routes for TechDocs, TechDocs Homepage and separate TechDocs page
 *
 * @public
 */
export declare const Router: () => JSX.Element;
/**
 * Responsible for registering route to view docs on Entity page
 *
 * @public
 */
export declare const EmbeddedDocsRouter: (props: PropsWithChildren<{}>) => JSX.Element | null;
