import { FunctionComponent } from 'react';
import { Reviews, Author } from '../../utils/types';
declare type Props = {
    title: string;
    createdAt: string;
    updatedAt?: string;
    author: Author;
    url: string;
    reviews: Reviews;
    repositoryName: string;
    isDraft: boolean;
};
declare const PullRequestCard: FunctionComponent<Props>;
export default PullRequestCard;
