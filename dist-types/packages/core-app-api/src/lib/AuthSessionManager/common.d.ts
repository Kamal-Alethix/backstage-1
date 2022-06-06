import { SessionScopesFunc } from './types';
export declare function hasScopes(searched: Set<string>, searchFor: Set<string>): boolean;
declare type ScopeHelperOptions<T> = {
    sessionScopes: SessionScopesFunc<T> | undefined;
    defaultScopes?: Set<string>;
};
export declare class SessionScopeHelper<T> {
    private readonly options;
    constructor(options: ScopeHelperOptions<T>);
    sessionExistsAndHasScope(session: T | undefined, scopes?: Set<string>): boolean;
    getExtendedScope(session: T | undefined, scopes?: Set<string>): Set<string>;
}
export {};
