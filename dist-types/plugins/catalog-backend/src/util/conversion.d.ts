import { Entity, LocationEntityV1alpha1 } from '@backstage/catalog-model';
import { LocationSpec } from '../api';
export declare function locationSpecToMetadataName(location: LocationSpec): string;
/** @public */
export declare function locationSpecToLocationEntity(opts: {
    location: LocationSpec;
    parentEntity?: Entity;
}): LocationEntityV1alpha1;
