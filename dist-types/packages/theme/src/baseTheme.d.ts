import { Overrides } from '@material-ui/core/styles/overrides';
import { BackstageTheme, BackstageThemeOptions, SimpleThemeOptions } from './types';
/**
 * A helper for creating theme options.
 *
 * @public
 */
export declare function createThemeOptions(options: SimpleThemeOptions): BackstageThemeOptions;
/**
 * A helper for creating theme overrides.
 *
 * @public
 */
export declare function createThemeOverrides(theme: BackstageTheme): Overrides;
/**
 * Creates a Backstage MUI theme using a palette. The theme is created with the
 * common Backstage options and component styles.
 *
 * @public
 */
export declare function createTheme(options: SimpleThemeOptions): BackstageTheme;
