/// <reference types="react" />
import { LinkProps } from '@material-ui/core';
import { IconComponent } from '@backstage/core-plugin-api';
export declare const IconLink: (props: {
    href: string;
    text?: string;
    Icon?: IconComponent;
} & LinkProps) => JSX.Element;
