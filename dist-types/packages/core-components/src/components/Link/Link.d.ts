import { LinkProps as MaterialLinkProps } from '@material-ui/core/Link';
import { ElementType } from 'react';
import { LinkProps as RouterLinkProps } from 'react-router-dom';
export declare const isExternalUri: (uri: string) => boolean;
export declare type LinkProps = MaterialLinkProps & RouterLinkProps & {
    component?: ElementType<any>;
    noTrack?: boolean;
};
/**
 * Thin wrapper on top of material-ui's Link component, which...
 * - Makes the Link use react-router
 * - Captures Link clicks as analytics events.
 */
export declare const Link: (props: LinkProps) => JSX.Element;
