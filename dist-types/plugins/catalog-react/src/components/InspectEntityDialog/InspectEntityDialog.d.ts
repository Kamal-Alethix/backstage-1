/// <reference types="react" />
import { Entity } from '@backstage/catalog-model';
/**
 * A dialog that lets users inspect the low level details of their entities.
 *
 * @public
 */
export declare function InspectEntityDialog(props: {
    open: boolean;
    entity: Entity;
    onClose: () => void;
}): JSX.Element | null;
