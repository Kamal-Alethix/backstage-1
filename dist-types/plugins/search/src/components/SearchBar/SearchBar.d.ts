/// <reference types="react" />
import { InputBaseProps } from '@material-ui/core';
/**
 * Props for {@link SearchBarBase}.
 *
 * @public
 */
export declare type SearchBarBaseProps = Omit<InputBaseProps, 'onChange'> & {
    debounceTime?: number;
    clearButton?: boolean;
    onClear?: () => void;
    onSubmit?: () => void;
    onChange: (value: string) => void;
};
/**
 * All search boxes exported by the search plugin are based on the <SearchBarBase />,
 * and this one is based on the <InputBase /> component from Material UI.
 * Recommended if you don't use Search Provider or Search Context.
 *
 * @public
 */
export declare const SearchBarBase: ({ onChange, onKeyDown, onSubmit, debounceTime, clearButton, fullWidth, value: defaultValue, inputProps: defaultInputProps, endAdornment: defaultEndAdornment, ...props }: SearchBarBaseProps) => JSX.Element;
/**
 * Props for {@link SearchBar}.
 *
 * @public
 */
export declare type SearchBarProps = Partial<SearchBarBaseProps>;
/**
 * Recommended search bar when you use the Search Provider or Search Context.
 *
 * @public
 */
export declare const SearchBar: ({ onChange, ...props }: SearchBarProps) => JSX.Element;
