/// <reference types="react" />
import { Entity } from '@backstage/catalog-model';
export declare const isKubernetesAvailable: (entity: Entity) => boolean;
export declare const Router: (props: {
    refreshIntervalMs?: number;
}) => JSX.Element;
