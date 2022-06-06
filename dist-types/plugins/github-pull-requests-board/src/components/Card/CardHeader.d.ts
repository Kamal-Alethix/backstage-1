import { FunctionComponent } from 'react';
declare type Props = {
    title: string;
    createdAt: string;
    updatedAt?: string;
    authorName: string;
    authorAvatar?: string;
    repositoryName: string;
};
declare const CardHeader: FunctionComponent<Props>;
export default CardHeader;
