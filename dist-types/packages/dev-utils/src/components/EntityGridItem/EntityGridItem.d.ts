/// <reference types="react" />
import { Entity } from '@backstage/catalog-model';
import { GridProps } from '@material-ui/core';
/** @public */
export declare const EntityGridItem: (props: Omit<GridProps, 'item' | 'container'> & {
    entity: Entity;
}) => JSX.Element;
