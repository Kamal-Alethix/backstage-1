import { AppOptions, BackstageApp } from './types';
/**
 * Creates a new Backstage App where the full set of options are required.
 *
 * @public
 * @param options - A set of options for creating the app
 * @returns
 * @remarks
 *
 * You will most likely want to use {@link @backstage/app-defaults#createApp},
 * however, this low-level API allows you to provide a full set of options,
 * including your own `components`, `icons`, `defaultApis`, and `themes`. This
 * is particularly useful if you are not using `@backstage/core-components` or
 * MUI, as it allows you to avoid those dependencies completely.
 */
export declare function createSpecializedApp(options: AppOptions): BackstageApp;
