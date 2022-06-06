import { ComponentType } from 'react';
/**
 * IconComponent is the common icon type used throughout Backstage when
 * working with and rendering generic icons, including the app system icons.
 *
 * @remarks
 *
 * The type is based on SvgIcon from MUI, but both do not what the plugin-api
 * package to have a dependency on MUI, nor do we want the props to be as broad
 * as the SvgIconProps interface.
 *
 * If you have the need to forward additional props from SvgIconProps, you can
 * open an issue or submit a PR to the main Backstage repo. When doing so please
 * also describe your use-case and reasoning of the addition.
 *
 * @public
 */
export declare type IconComponent = ComponentType<{
    fontSize?: 'default' | 'small' | 'large';
}>;
