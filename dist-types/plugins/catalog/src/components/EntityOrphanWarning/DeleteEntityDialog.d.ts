/// <reference types="react" />
import { Entity } from '@backstage/catalog-model';
interface DeleteEntityDialogProps {
    open: boolean;
    onClose: () => any;
    onConfirm: () => any;
    entity: Entity;
}
export declare function DeleteEntityDialog(props: DeleteEntityDialogProps): JSX.Element;
export {};
