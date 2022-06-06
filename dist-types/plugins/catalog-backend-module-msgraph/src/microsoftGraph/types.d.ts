import { GroupEntity, UserEntity } from '@backstage/catalog-model';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
/**
 * Customize the ingested User entity
 *
 * @public
 */
export declare type UserTransformer = (user: MicrosoftGraph.User, userPhoto?: string) => Promise<UserEntity | undefined>;
/**
 * Customize the ingested organization Group entity
 *
 * @public
 */
export declare type OrganizationTransformer = (organization: MicrosoftGraph.Organization) => Promise<GroupEntity | undefined>;
/**
 * Customize the ingested Group entity
 *
 * @public
 */
export declare type GroupTransformer = (group: MicrosoftGraph.Group, groupPhoto?: string) => Promise<GroupEntity | undefined>;
