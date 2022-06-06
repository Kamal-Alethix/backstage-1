import { CSSProperties } from 'react';
/** @public */
export declare type AvatarClassKey = 'avatar';
/**
 * Properties for {@link Avatar}.
 *
 * @public
 */
export interface AvatarProps {
    /**
     * A display name, which will be used to generate initials as a fallback in case a picture is not provided.
     */
    displayName?: string;
    /**
     * URL to avatar image source
     */
    picture?: string;
    /**
     * Custom styles applied to avatar
     */
    customStyles?: CSSProperties;
}
/**
 *  Component rendering an Avatar
 *
 * @public
 * @remarks
 *
 * Based on https://v4.mui.com/components/avatars/#avatar with some styling adjustment and two-letter initials
 */
export declare function Avatar(props: AvatarProps): JSX.Element;
