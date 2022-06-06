import { PageTheme } from './types';
/**
 * The default predefined burst shapes.
 *
 * @public
 * @remarks
 *
 * How to add a shape:
 *
 * 1. Get the svg shape from figma, should be ~1400 wide, ~400 high
 *    and only the white-to-transparent mask, no colors.
 * 2. Run it through https://jakearchibald.github.io/svgomg/
 * 3. Run that through https://github.com/tigt/mini-svg-data-uri
 *    with something like https://npm.runkit.com/mini-svg-data-uri
 * 4. Wrap the output in `url("")`
 * 5. Give it a name and paste it into the `shapes` object below.
 */
export declare const shapes: Record<string, string>;
/**
 * The color range variants that are used in e.g. colorful bursts.
 *
 * @public
 */
export declare const colorVariants: Record<string, string[]>;
/**
 * Utility to not have to write colors and shapes twice.
 *
 * @public
 * @remarks
 *
 * As the background shapes and colors are decorative, we place them onto the
 * page as a css background-image instead of an html element of its own.
 */
export declare function genPageTheme(colors: string[], shape: string): PageTheme;
/**
 * All of the builtin page themes.
 *
 * @public
 */
export declare const pageTheme: Record<string, PageTheme>;
