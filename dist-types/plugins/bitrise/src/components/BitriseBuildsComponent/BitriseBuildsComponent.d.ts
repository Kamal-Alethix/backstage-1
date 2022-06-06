/// <reference types="react" />
import { Entity } from '@backstage/catalog-model';
export declare type Props = {
    entity: Entity;
};
export declare const BITRISE_APP_ANNOTATION = "bitrise.io/app";
export declare const isBitriseAvailable: (entity: Entity) => boolean;
export declare const BitriseBuildsComponent: () => JSX.Element;
