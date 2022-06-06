import { UserEntity } from '@backstage/catalog-model';
import { TokenParams } from '../../identity';
/**
 * @deprecated use {@link getDefaultOwnershipEntityRefs} instead
 */
export declare function getEntityClaims(entity: UserEntity): TokenParams['claims'];
