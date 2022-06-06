import { AppThemeApi, AppTheme } from '@backstage/core-plugin-api';
import { Observable } from '@backstage/types';
/**
 * Exposes the themes installed in the app, and permits switching the currently
 * active theme.
 *
 * @public
 */
export declare class AppThemeSelector implements AppThemeApi {
    private readonly themes;
    static createWithStorage(themes: AppTheme[]): AppThemeSelector;
    private activeThemeId;
    private readonly subject;
    constructor(themes: AppTheme[]);
    getInstalledThemes(): AppTheme[];
    activeThemeId$(): Observable<string | undefined>;
    getActiveThemeId(): string | undefined;
    setActiveThemeId(themeId?: string): void;
}
