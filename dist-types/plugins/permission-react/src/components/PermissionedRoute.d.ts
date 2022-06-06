import { ComponentProps, ReactElement } from 'react';
import { Route } from 'react-router';
import { Permission, ResourcePermission } from '@backstage/plugin-permission-common';
/**
 * Returns a React Router Route which only renders the element when authorized. If unauthorized, the Route will render a
 * NotFoundErrorPage (see {@link @backstage/core-app-api#AppComponents}).
 *
 * @public
 */
export declare const PermissionedRoute: (props: ComponentProps<typeof Route> & {
    errorComponent?: ReactElement | null;
} & ({
    permission: Exclude<Permission, ResourcePermission>;
    resourceRef?: never;
} | {
    permission: ResourcePermission;
    resourceRef: string | undefined;
})) => JSX.Element;
