/// <reference types="react" />
import { Status } from '../../api';
export declare const transformStatus: (value: Status) => JSX.Element;
export declare const transformRunStatus: (x: Status[]) => {
    status: JSX.Element;
    message: string;
}[];
declare const ProfileCatalog: () => JSX.Element;
export default ProfileCatalog;
