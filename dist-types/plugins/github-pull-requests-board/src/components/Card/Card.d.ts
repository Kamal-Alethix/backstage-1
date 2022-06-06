import { FunctionComponent } from 'react';
declare type Props = {
    title: string;
    createdAt: string;
    updatedAt?: string;
    prUrl: string;
    authorName: string;
    authorAvatar?: string;
    repositoryName: string;
};
declare const Card: FunctionComponent<Props>;
export default Card;
