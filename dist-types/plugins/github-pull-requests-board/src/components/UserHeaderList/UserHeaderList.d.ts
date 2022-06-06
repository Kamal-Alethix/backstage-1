import { FunctionComponent } from 'react';
import { Author } from '../../utils/types';
declare type Props = {
    label?: string;
    users: Author[];
};
declare const UserHeaderList: FunctionComponent<Props>;
export default UserHeaderList;
