/// <reference types="react" />
import { PendingOAuthRequest } from '@backstage/core-plugin-api';
export declare type LoginRequestListItemClassKey = 'root';
declare type RowProps = {
    request: PendingOAuthRequest;
    busy: boolean;
    setBusy: (busy: boolean) => void;
};
declare const LoginRequestListItem: ({ request, busy, setBusy }: RowProps) => JSX.Element;
export default LoginRequestListItem;
