import { Plugin } from 'rollup';
declare type ForwardFileImportsOptions = {
    include: Array<string | RegExp> | string | RegExp | null;
    exclude?: Array<string | RegExp> | string | RegExp | null;
};
/**
 * This rollup plugin leaves all encountered asset imports as-is, but
 * copies the imported files into the output directory.
 *
 * For example `import ImageUrl from './my-image.png'` inside `src/MyComponent` will
 * cause `src/MyComponent/my-image.png` to be copied to the output directory at the
 * path `dist/MyComponent/my-image.png`. The import itself will stay, but be resolved,
 * resulting in something like `import ImageUrl from './MyComponent/my-image.png'`
 */
export declare function forwardFileImports(options: ForwardFileImportsOptions): Plugin;
export {};
