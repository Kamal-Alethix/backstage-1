import { BazaarProject, Member } from '../types';
import { BazaarApi } from '../api';
import { Entity } from '@backstage/catalog-model';
import { CatalogApi } from '@backstage/plugin-catalog-react';
export declare const fetchProjectMembers: (bazaarApi: BazaarApi, project: BazaarProject) => Promise<Member[]>;
export declare const fetchCatalogItems: (catalogApi: CatalogApi) => Promise<Entity[]>;
