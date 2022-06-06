import { Entity } from '@backstage/catalog-model';
import { IconButton } from '@material-ui/core';
import { ComponentProps } from 'react';
/** @public */
export declare type FavoriteEntityProps = ComponentProps<typeof IconButton> & {
    entity: Entity;
};
/**
 * IconButton for showing if a current entity is starred and adding/removing it from the favorite entities
 * @param props - MaterialUI IconButton props extended by required `entity` prop
 * @public
 */
export declare const FavoriteEntity: (props: FavoriteEntityProps) => JSX.Element;
