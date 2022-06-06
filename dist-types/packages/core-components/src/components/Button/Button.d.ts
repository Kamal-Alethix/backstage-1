/// <reference types="react" />
import { ButtonProps as MaterialButtonProps } from '@material-ui/core/Button';
import { LinkProps } from '../Link';
/**
 * Properties for {@link Button}
 *
 * @public
 * @remarks
 *
 * See {@link https://v4.mui.com/api/button/#props | Material-UI Button Props} for all properties
 */
export declare type ButtonProps = MaterialButtonProps & Omit<LinkProps, 'variant' | 'color'>;
/**
 * Thin wrapper on top of material-ui's {@link https://v4.mui.com/components/buttons/ | Button} component
 *
 * @public
 * @remarks
 *
 * Makes the Button to utilise react-router
 */
export declare const Button: (props: ButtonProps) => JSX.Element;
