/// <reference types="react" />
import { Entity } from '../../types';
import { ProductEntityTableOptions } from './ProductEntityTable';
declare type ProductEntityDialogProps = {
    open: boolean;
    entity: Entity;
    options?: ProductEntityTableOptions;
    onClose: () => void;
};
export declare const ProductEntityDialog: ({ open, entity, options, onClose, }: ProductEntityDialogProps) => JSX.Element;
export {};
