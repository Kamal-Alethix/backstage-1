/// <reference types="react" />
import { LinkProps } from 'react-router-dom';
/**
 * Properties for {@link CreateButton}
 *
 * @public
 */
export declare type CreateButtonProps = {
    title: string;
} & Partial<Pick<LinkProps, 'to'>>;
/**
 * Responsive Button giving consistent UX for creation of different things
 *
 * @public
 */
export declare function CreateButton(props: CreateButtonProps): JSX.Element | null;
