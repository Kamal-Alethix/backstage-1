import { Entity } from '@backstage/catalog-model';
import { Reviews, PullRequests, PullRequestsColumn, Author } from './types';
export declare const getProjectNameFromEntity: (entity: Entity) => string;
export declare const getApprovedReviews: (reviews?: Reviews) => Reviews;
export declare const getCommentedReviews: (reviews?: Reviews) => Reviews;
export declare const getChangeRequests: (reviews?: Reviews) => Reviews;
export declare const filterSameUser: (users: Author[]) => Author[];
export declare const getElapsedTime: (start: string) => string;
export declare const formatPRsByReviewDecision: (prs: PullRequests) => PullRequestsColumn[];
