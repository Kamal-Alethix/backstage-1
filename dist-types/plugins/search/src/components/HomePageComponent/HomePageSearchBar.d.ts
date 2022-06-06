/// <reference types="react" />
import { SearchBarBaseProps } from '../SearchBar';
/**
 * Props for {@link HomePageSearchBar}.
 *
 * @public
 */
export declare type HomePageSearchBarProps = Partial<Omit<SearchBarBaseProps, 'onChange' | 'onSubmit'>>;
/**
 * The search bar created specifically for the composable home page
 *
 * @public
 */
export declare const HomePageSearchBar: ({ ...props }: HomePageSearchBarProps) => JSX.Element;
