/// <reference types="react" />
import { Entity } from '@backstage/catalog-model';
/** @public */
export declare type UnregisterEntityDialogProps = {
    open: boolean;
    onConfirm: () => any;
    onClose: () => any;
    entity: Entity;
};
/** @public */
export declare const UnregisterEntityDialog: (props: UnregisterEntityDialogProps) => JSX.Element;
