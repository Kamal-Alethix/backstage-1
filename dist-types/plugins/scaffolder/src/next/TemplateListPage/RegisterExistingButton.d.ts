/// <reference types="react" />
import { LinkProps } from 'react-router-dom';
/**
 * Properties for {@link RegisterExistingButton}
 *
 * @alpha
 */
export declare type RegisterExistingButtonProps = {
    title: string;
} & Partial<Pick<LinkProps, 'to'>>;
/**
 * A button that helps users to register an existing component.
 * @alpha
 */
export declare const RegisterExistingButton: (props: RegisterExistingButtonProps) => JSX.Element | null;
