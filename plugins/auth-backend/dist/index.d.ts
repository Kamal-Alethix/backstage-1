/// <reference types="node" />
import express from 'express';
import { Logger } from 'winston';
import { TokenManager, PluginEndpointDiscovery, PluginDatabaseManager } from '@backstage/backend-common';
import { CatalogApi, GetEntitiesRequest } from '@backstage/catalog-client';
import { Config } from '@backstage/config';
import { BackstageSignInResult, BackstageIdentityResponse } from '@backstage/plugin-auth-node';
import { Profile } from 'passport';
import { UserEntity, Entity } from '@backstage/catalog-model';
import { IncomingHttpHeaders } from 'http';
import { TokenSet, UserinfoResponse } from 'openid-client';
import { JsonValue } from '@backstage/types';

/** Represents any form of serializable JWK */
interface AnyJWK extends Record<string, string> {
    use: 'sig';
    alg: string;
    kid: string;
    kty: string;
}
/**
 * Parameters used to issue new ID Tokens
 *
 * @public
 */
declare type TokenParams = {
    /** The claims that will be embedded within the token */
    claims: {
        /** The token subject, i.e. User ID */
        sub: string;
        /** A list of entity references that the user claims ownership through */
        ent?: string[];
    };
};
/**
 * A TokenIssuer is able to issue verifiable ID Tokens on demand.
 *
 * @public
 * @deprecated This interface is deprecated and will be removed in a future release.
 */
declare type TokenIssuer = {
    /**
     * Issues a new ID Token
     */
    issueToken(params: TokenParams): Promise<string>;
    /**
     * List all public keys that are currently being used to sign tokens, or have been used
     * in the past within the token expiration time, including a grace period.
     */
    listPublicKeys(): Promise<{
        keys: AnyJWK[];
    }>;
};

/**
 * Common options for passport.js-based OAuth providers
 */
declare type OAuthProviderOptions = {
    /**
     * Client ID of the auth provider.
     */
    clientId: string;
    /**
     * Client Secret of the auth provider.
     */
    clientSecret: string;
    /**
     * Callback URL to be passed to the auth provider to redirect to after the user signs in.
     */
    callbackUrl: string;
};
declare type OAuthResult = {
    fullProfile: Profile;
    params: {
        id_token?: string;
        scope: string;
        expires_in: number;
    };
    accessToken: string;
    refreshToken?: string;
};
/**
 * The expected response from an OAuth flow.
 *
 * @public
 */
declare type OAuthResponse = {
    profile: ProfileInfo;
    providerInfo: OAuthProviderInfo;
    backstageIdentity?: BackstageSignInResult;
};
declare type OAuthProviderInfo = {
    /**
     * An access token issued for the signed in user.
     */
    accessToken: string;
    /**
     * (Optional) Id token issued for the signed in user.
     */
    idToken?: string;
    /**
     * Expiry of the access token in seconds.
     */
    expiresInSeconds?: number;
    /**
     * Scopes granted for the access token.
     */
    scope: string;
};
declare type OAuthState = {
    nonce: string;
    env: string;
    origin?: string;
    scope?: string;
};
declare type OAuthStartRequest = express.Request<{}> & {
    scope: string;
    state: OAuthState;
};
declare type OAuthRefreshRequest = express.Request<{}> & {
    scope: string;
    refreshToken: string;
};
/**
 * Any OAuth provider needs to implement this interface which has provider specific
 * handlers for different methods to perform authentication, get access tokens,
 * refresh tokens and perform sign out.
 *
 * @public
 */
interface OAuthHandlers {
    /**
     * Initiate a sign in request with an auth provider.
     */
    start(req: OAuthStartRequest): Promise<RedirectInfo>;
    /**
     * Handle the redirect from the auth provider when the user has signed in.
     */
    handler(req: express.Request): Promise<{
        response: OAuthResponse;
        refreshToken?: string;
    }>;
    /**
     * (Optional) Given a refresh token and scope fetches a new access token from the auth provider.
     */
    refresh?(req: OAuthRefreshRequest): Promise<{
        response: OAuthResponse;
        refreshToken?: string;
    }>;
    /**
     * (Optional) Sign out of the auth provider.
     */
    logout?(): Promise<void>;
}

declare type UserQuery = {
    annotations: Record<string, string>;
};
declare type MemberClaimQuery = {
    entityRefs: string[];
    logger?: Logger;
};
/**
 * A catalog client tailored for reading out identity data from the catalog.
 */
declare class CatalogIdentityClient {
    private readonly catalogApi;
    private readonly tokenManager;
    constructor(options: {
        catalogApi: CatalogApi;
        tokenManager: TokenManager;
    });
    /**
     * Looks up a single user using a query.
     *
     * Throws a NotFoundError or ConflictError if 0 or multiple users are found.
     */
    findUser(query: UserQuery): Promise<UserEntity>;
    /**
     * Resolve additional entity claims from the catalog, using the passed-in entity names. Designed
     * to be used within a `signInResolver` where additional entity claims might be provided, but
     * group membership and transient group membership lean on imported catalog relations.
     *
     * Returns a superset of the entity names that can be passed directly to `issueToken` as `ent`.
     */
    resolveCatalogMembership(query: MemberClaimQuery): Promise<string[]>;
}

/**
 * @deprecated use {@link getDefaultOwnershipEntityRefs} instead
 */
declare function getEntityClaims(entity: UserEntity): TokenParams['claims'];

/**
 * A query for a single user in the catalog.
 *
 * If `entityRef` is used, the default kind is `'User'`.
 *
 * If `annotations` are used, all annotations must be present and
 * match the provided value exactly. Only entities of kind `'User'` will be considered.
 *
 * If `filter` are used they are passed on as they are to the `CatalogApi`.
 *
 * Regardless of the query method, the query must match exactly one entity
 * in the catalog, or an error will be thrown.
 *
 * @public
 */
declare type AuthResolverCatalogUserQuery = {
    entityRef: string | {
        kind?: string;
        namespace?: string;
        name: string;
    };
} | {
    annotations: Record<string, string>;
} | {
    filter: Exclude<GetEntitiesRequest['filter'], undefined>;
};
/**
 * The context that is used for auth processing.
 *
 * @public
 */
declare type AuthResolverContext = {
    /** @deprecated Will be removed from the context, access it via a closure instead if needed */
    logger: Logger;
    /** @deprecated Use the `issueToken` method instead */
    tokenIssuer: TokenIssuer;
    /** @deprecated Use the `findCatalogUser` and `signInWithCatalogUser` methods instead, and the `getDefaultOwnershipEntityRefs` helper */
    catalogIdentityClient: CatalogIdentityClient;
    /**
     * Issues a Backstage token using the provided parameters.
     */
    issueToken(params: TokenParams): Promise<{
        token: string;
    }>;
    /**
     * Finds a single user in the catalog using the provided query.
     *
     * See {@link AuthResolverCatalogUserQuery} for details.
     */
    findCatalogUser(query: AuthResolverCatalogUserQuery): Promise<{
        entity: Entity;
    }>;
    /**
     * Finds a single user in the catalog using the provided query, and then
     * issues an identity for that user using default ownership resolution.
     *
     * See {@link AuthResolverCatalogUserQuery} for details.
     */
    signInWithCatalogUser(query: AuthResolverCatalogUserQuery): Promise<BackstageSignInResult>;
};
/**
 * The callback used to resolve the cookie configuration for auth providers that use cookies.
 * @public
 */
declare type CookieConfigurer = (ctx: {
    /** ID of the auth provider that this configuration applies to */
    providerId: string;
    /** The externally reachable base URL of the auth-backend plugin */
    baseUrl: string;
    /** The configured callback URL of the auth provider */
    callbackUrl: string;
}) => {
    domain: string;
    path: string;
    secure: boolean;
};
/** @public */
declare type AuthProviderConfig = {
    /**
     * The protocol://domain[:port] where the app is hosted. This is used to construct the
     * callbackURL to redirect to once the user signs in to the auth provider.
     */
    baseUrl: string;
    /**
     * The base URL of the app as provided by app.baseUrl
     */
    appUrl: string;
    /**
     * A function that is called to check whether an origin is allowed to receive the authentication result.
     */
    isOriginAllowed: (origin: string) => boolean;
    /**
     * The function used to resolve cookie configuration based on the auth provider options.
     */
    cookieConfigurer?: CookieConfigurer;
};
declare type RedirectInfo = {
    /**
     * URL to redirect to
     */
    url: string;
    /**
     * Status code to use for the redirect
     */
    status?: number;
};
/**
 * Any Auth provider needs to implement this interface which handles the routes in the
 * auth backend. Any auth API requests from the frontend reaches these methods.
 *
 * The routes in the auth backend API are tied to these methods like below
 *
 * `/auth/[provider]/start -> start`
 * `/auth/[provider]/handler/frame -> frameHandler`
 * `/auth/[provider]/refresh -> refresh`
 * `/auth/[provider]/logout -> logout`
 */
interface AuthProviderRouteHandlers {
    /**
     * Handles the start route of the API. This initiates a sign in request with an auth provider.
     *
     * Request
     * - scopes for the auth request (Optional)
     * Response
     * - redirect to the auth provider for the user to sign in or consent.
     * - sets a nonce cookie and also pass the nonce as 'state' query parameter in the redirect request
     */
    start(req: express.Request, res: express.Response): Promise<void>;
    /**
     * Once the user signs in or consents in the OAuth screen, the auth provider redirects to the
     * callbackURL which is handled by this method.
     *
     * Request
     * - to contain a nonce cookie and a 'state' query parameter
     * Response
     * - postMessage to the window with a payload that contains accessToken, expiryInSeconds?, idToken? and scope.
     * - sets a refresh token cookie if the auth provider supports refresh tokens
     */
    frameHandler(req: express.Request, res: express.Response): Promise<void>;
    /**
     * (Optional) If the auth provider supports refresh tokens then this method handles
     * requests to get a new access token.
     *
     * Request
     * - to contain a refresh token cookie and scope (Optional) query parameter.
     * Response
     * - payload with accessToken, expiryInSeconds?, idToken?, scope and user profile information.
     */
    refresh?(req: express.Request, res: express.Response): Promise<void>;
    /**
     * (Optional) Handles sign out requests
     *
     * Response
     * - removes the refresh token cookie
     */
    logout?(req: express.Request, res: express.Response): Promise<void>;
}
/**
 * @deprecated This type is deprecated and will be removed in a future release.
 */
declare type AuthProviderFactoryOptions = {
    providerId: string;
    globalConfig: AuthProviderConfig;
    config: Config;
    logger: Logger;
    tokenManager: TokenManager;
    tokenIssuer: TokenIssuer;
    discovery: PluginEndpointDiscovery;
    catalogApi: CatalogApi;
};
declare type AuthProviderFactory = (options: {
    providerId: string;
    globalConfig: AuthProviderConfig;
    config: Config;
    logger: Logger;
    resolverContext: AuthResolverContext;
    /** @deprecated This field has been deprecated and needs to be passed directly to the auth provider instead */
    tokenManager: TokenManager;
    /** @deprecated This field has been deprecated and needs to be passed directly to the auth provider instead */
    tokenIssuer: TokenIssuer;
    /** @deprecated This field has been deprecated and needs to be passed directly to the auth provider instead */
    discovery: PluginEndpointDiscovery;
    /** @deprecated This field has been deprecated and needs to be passed directly to the auth provider instead */
    catalogApi: CatalogApi;
}) => AuthProviderRouteHandlers;
/** @public */
declare type AuthResponse<ProviderInfo> = {
    providerInfo: ProviderInfo;
    profile: ProfileInfo;
    backstageIdentity?: BackstageIdentityResponse;
};
/**
 * Used to display login information to user, i.e. sidebar popup.
 *
 * It is also temporarily used as the profile of the signed-in user's Backstage
 * identity, but we want to replace that with data from identity and/org catalog
 * service
 *
 * @public
 */
declare type ProfileInfo = {
    /**
     * Email ID of the signed in user.
     */
    email?: string;
    /**
     * Display name that can be presented to the signed in user.
     */
    displayName?: string;
    /**
     * URL to an image that can be used as the display image or avatar of the
     * signed in user.
     */
    picture?: string;
};
/**
 * Type of sign in information context. Includes the profile information and
 * authentication result which contains auth related information.
 *
 * @public
 */
declare type SignInInfo<TAuthResult> = {
    /**
     * The simple profile passed down for use in the frontend.
     */
    profile: ProfileInfo;
    /**
     * The authentication result that was received from the authentication
     * provider.
     */
    result: TAuthResult;
};
/**
 * Describes the function which handles the result of a successful
 * authentication. Must return a valid {@link @backstage/plugin-auth-node#BackstageSignInResult}.
 *
 * @public
 */
declare type SignInResolver<TAuthResult> = (info: SignInInfo<TAuthResult>, context: AuthResolverContext) => Promise<BackstageSignInResult>;
/**
 * The return type of an authentication handler. Must contain valid profile
 * information.
 *
 * @public
 */
declare type AuthHandlerResult = {
    profile: ProfileInfo;
};
/**
 * The AuthHandler function is called every time the user authenticates using
 * the provider.
 *
 * The handler should return a profile that represents the session for the user
 * in the frontend.
 *
 * Throwing an error in the function will cause the authentication to fail,
 * making it possible to use this function as a way to limit access to a certain
 * group of users.
 *
 * @public
 */
declare type AuthHandler<TAuthResult> = (input: TAuthResult, context: AuthResolverContext) => Promise<AuthHandlerResult>;
/** @public */
declare type StateEncoder = (req: OAuthStartRequest) => Promise<{
    encodedState: string;
}>;

declare class OAuthEnvironmentHandler implements AuthProviderRouteHandlers {
    private readonly handlers;
    static mapConfig(config: Config, factoryFunc: (envConfig: Config) => AuthProviderRouteHandlers): OAuthEnvironmentHandler;
    constructor(handlers: Map<string, AuthProviderRouteHandlers>);
    start(req: express.Request, res: express.Response): Promise<void>;
    frameHandler(req: express.Request, res: express.Response): Promise<void>;
    refresh(req: express.Request, res: express.Response): Promise<void>;
    logout(req: express.Request, res: express.Response): Promise<void>;
    private getRequestFromEnv;
    private getProviderForEnv;
}

declare type Options = {
    providerId: string;
    secure: boolean;
    persistScopes?: boolean;
    cookieDomain: string;
    cookiePath: string;
    appOrigin: string;
    /** @deprecated This option is no longer needed */
    tokenIssuer?: TokenIssuer;
    isOriginAllowed: (origin: string) => boolean;
    callbackUrl: string;
};
declare class OAuthAdapter implements AuthProviderRouteHandlers {
    private readonly handlers;
    private readonly options;
    static fromConfig(config: AuthProviderConfig, handlers: OAuthHandlers, options: Pick<Options, 'providerId' | 'persistScopes' | 'tokenIssuer' | 'callbackUrl'>): OAuthAdapter;
    private readonly baseCookieOptions;
    constructor(handlers: OAuthHandlers, options: Options);
    start(req: express.Request, res: express.Response): Promise<void>;
    frameHandler(req: express.Request, res: express.Response): Promise<void>;
    logout(req: express.Request, res: express.Response): Promise<void>;
    refresh(req: express.Request, res: express.Response): Promise<void>;
    /**
     * If the response from the OAuth provider includes a Backstage identity, we
     * make sure it's populated with all the information we can derive from the user ID.
     */
    private populateIdentity;
    private setNonceCookie;
    private setGrantedScopeCookie;
    private getGrantedScopeFromCookie;
    private setRefreshTokenCookie;
    private removeRefreshTokenCookie;
}

declare const readState: (stateString: string) => OAuthState;
declare const encodeState: (state: OAuthState) => string;
declare const verifyNonce: (req: express.Request, providerId: string) => void;

declare type AtlassianAuthProviderOptions = OAuthProviderOptions & {
    scopes: string;
    signInResolver?: SignInResolver<OAuthResult>;
    authHandler: AuthHandler<OAuthResult>;
    resolverContext: AuthResolverContext;
};
declare class AtlassianAuthProvider implements OAuthHandlers {
    private readonly _strategy;
    private readonly signInResolver?;
    private readonly authHandler;
    private readonly resolverContext;
    constructor(options: AtlassianAuthProviderOptions);
    start(req: OAuthStartRequest): Promise<RedirectInfo>;
    handler(req: express.Request): Promise<{
        response: OAuthResponse;
        refreshToken: string | undefined;
    }>;
    private handleResult;
    refresh(req: OAuthRefreshRequest): Promise<{
        response: OAuthResponse;
        refreshToken: string | undefined;
    }>;
}
/**
 * @public
 * @deprecated This type has been inlined into the create method and will be removed.
 */
declare type AtlassianProviderOptions = {
    /**
     * The profile transformation function used to verify and convert the auth response
     * into the profile that will be presented to the user.
     */
    authHandler?: AuthHandler<OAuthResult>;
    /**
     * Configure sign-in for this provider, without it the provider can not be used to sign users in.
     */
    signIn?: {
        resolver: SignInResolver<OAuthResult>;
    };
};
/**
 * @public
 * @deprecated Use `providers.atlassian.create` instead
 */
declare const createAtlassianProvider: (options?: {
    /**
     * The profile transformation function used to verify and convert the auth response
     * into the profile that will be presented to the user.
     */
    authHandler?: AuthHandler<OAuthResult> | undefined;
    /**
     * Configure sign-in for this provider, without it the provider can not be used to sign users in.
     */
    signIn?: {
        resolver: SignInResolver<OAuthResult>;
    } | undefined;
} | undefined) => AuthProviderFactory;

/**
 * @public
 * @deprecated This type has been inlined into the create method and will be removed.
 */
declare type Auth0ProviderOptions = {
    /**
     * The profile transformation function used to verify and convert the auth response
     * into the profile that will be presented to the user.
     */
    authHandler?: AuthHandler<OAuthResult>;
    /**
     * Configure sign-in for this provider, without it the provider can not be used to sign users in.
     */
    signIn?: {
        /**
         * Maps an auth result to a Backstage identity for the user.
         */
        resolver: SignInResolver<OAuthResult>;
    };
};
/**
 * @public
 * @deprecated Use `providers.auth0.create` instead.
 */
declare const createAuth0Provider: (options?: {
    /**
     * The profile transformation function used to verify and convert the auth response
     * into the profile that will be presented to the user.
     */
    authHandler?: AuthHandler<OAuthResult> | undefined;
    /**
     * Configure sign-in for this provider, without it the provider can not be used to sign users in.
     */
    signIn?: {
        /**
         * Maps an auth result to a Backstage identity for the user.
         */
        resolver: SignInResolver<OAuthResult>;
    } | undefined;
} | undefined) => AuthProviderFactory;

/** @public */
declare type AwsAlbResult = {
    fullProfile: Profile;
    expiresInSeconds?: number;
    accessToken: string;
};
/**
 * @public
 * @deprecated This type has been inlined into the create method and will be removed.
 */
declare type AwsAlbProviderOptions = {
    /**
     * The profile transformation function used to verify and convert the auth response
     * into the profile that will be presented to the user.
     */
    authHandler?: AuthHandler<AwsAlbResult>;
    /**
     * Configure sign-in for this provider, without it the provider can not be used to sign users in.
     */
    signIn: {
        /**
         * Maps an auth result to a Backstage identity for the user.
         */
        resolver: SignInResolver<AwsAlbResult>;
    };
};
/**
 * @public
 * @deprecated Use `providers.awsAlb.create` instead
 */
declare const createAwsAlbProvider: (options?: {
    /**
     * The profile transformation function used to verify and convert the auth response
     * into the profile that will be presented to the user.
     */
    authHandler?: AuthHandler<AwsAlbResult> | undefined;
    /**
     * Configure sign-in for this provider, without it the provider can not be used to sign users in.
     */
    signIn: {
        /**
         * Maps an auth result to a Backstage identity for the user.
         */
        resolver: SignInResolver<AwsAlbResult>;
    };
} | undefined) => AuthProviderFactory;

declare type BitbucketOAuthResult = {
    fullProfile: BitbucketPassportProfile;
    params: {
        id_token?: string;
        scope: string;
        expires_in: number;
    };
    accessToken: string;
    refreshToken?: string;
};
declare type BitbucketPassportProfile = Profile & {
    id?: string;
    displayName?: string;
    username?: string;
    avatarUrl?: string;
    _json?: {
        links?: {
            avatar?: {
                href?: string;
            };
        };
    };
};
/**
 * @public
 * @deprecated This type has been inlined into the create method and will be removed.
 */
declare type BitbucketProviderOptions = {
    /**
     * The profile transformation function used to verify and convert the auth response
     * into the profile that will be presented to the user.
     */
    authHandler?: AuthHandler<OAuthResult>;
    /**
     * Configure sign-in for this provider, without it the provider can not be used to sign users in.
     */
    signIn?: {
        /**
         * Maps an auth result to a Backstage identity for the user.
         */
        resolver: SignInResolver<OAuthResult>;
    };
};
/**
 * @public
 * @deprecated Use `providers.bitbucket.create` instead
 */
declare const createBitbucketProvider: (options?: {
    /**
     * The profile transformation function used to verify and convert the auth response
     * into the profile that will be presented to the user.
     */
    authHandler?: AuthHandler<OAuthResult> | undefined;
    /**
     * Configure sign-in for this provider, without it the provider can not be used to sign users in.
     */
    signIn?: {
        /**
         * Maps an auth result to a Backstage identity for the user.
         */
        resolver: SignInResolver<OAuthResult>;
    } | undefined;
} | undefined) => AuthProviderFactory;
/**
 * @public
 * @deprecated Use `providers.bitbucket.resolvers.usernameMatchingUserEntityAnnotation()` instead.
 */
declare const bitbucketUsernameSignInResolver: SignInResolver<OAuthResult>;
/**
 * @public
 * @deprecated Use `providers.bitbucket.resolvers.userIdMatchingUserEntityAnnotation()` instead.
 */
declare const bitbucketUserIdSignInResolver: SignInResolver<OAuthResult>;

declare type GithubOAuthResult = {
    fullProfile: Profile;
    params: {
        scope: string;
        expires_in?: string;
        refresh_token_expires_in?: string;
    };
    accessToken: string;
    refreshToken?: string;
};
/**
 * @public
 * @deprecated This type has been inlined into the create method and will be removed.
 */
declare type GithubProviderOptions = {
    /**
     * The profile transformation function used to verify and convert the auth response
     * into the profile that will be presented to the user.
     */
    authHandler?: AuthHandler<GithubOAuthResult>;
    /**
     * Configure sign-in for this provider, without it the provider can not be used to sign users in.
     */
    signIn?: {
        /**
         * Maps an auth result to a Backstage identity for the user.
         */
        resolver: SignInResolver<GithubOAuthResult>;
    };
    /**
     * The state encoder used to encode the 'state' parameter on the OAuth request.
     *
     * It should return a string that takes the state params (from the request), url encodes the params
     * and finally base64 encodes them.
     *
     * Providing your own stateEncoder will allow you to add addition parameters to the state field.
     *
     * It is typed as follows:
     *   `export type StateEncoder = (input: OAuthState) => Promise<{encodedState: string}>;`
     *
     * Note: the stateEncoder must encode a 'nonce' value and an 'env' value. Without this, the OAuth flow will fail
     * (These two values will be set by the req.state by default)
     *
     * For more information, please see the helper module in ../../oauth/helpers #readState
     */
    stateEncoder?: StateEncoder;
};
/**
 * @public
 * @deprecated Use `providers.github.create` instead
 */
declare const createGithubProvider: (options?: {
    /**
     * The profile transformation function used to verify and convert the auth response
     * into the profile that will be presented to the user.
     */
    authHandler?: AuthHandler<GithubOAuthResult> | undefined;
    /**
     * Configure sign-in for this provider, without it the provider can not be used to sign users in.
     */
    signIn?: {
        /**
         * Maps an auth result to a Backstage identity for the user.
         */
        resolver: SignInResolver<GithubOAuthResult>;
    } | undefined;
    /**
     * The state encoder used to encode the 'state' parameter on the OAuth request.
     *
     * It should return a string that takes the state params (from the request), url encodes the params
     * and finally base64 encodes them.
     *
     * Providing your own stateEncoder will allow you to add addition parameters to the state field.
     *
     * It is typed as follows:
     *   `export type StateEncoder = (input: OAuthState) => Promise<{encodedState: string}>;`
     *
     * Note: the stateEncoder must encode a 'nonce' value and an 'env' value. Without this, the OAuth flow will fail
     * (These two values will be set by the req.state by default)
     *
     * For more information, please see the helper module in ../../oauth/helpers #readState
     */
    stateEncoder?: StateEncoder | undefined;
} | undefined) => AuthProviderFactory;

/**
 * @public
 * @deprecated This type has been inlined into the create method and will be removed.
 */
declare type GitlabProviderOptions = {
    /**
     * The profile transformation function used to verify and convert the auth response
     * into the profile that will be presented to the user.
     */
    authHandler?: AuthHandler<OAuthResult>;
    /**
     * Configure sign-in for this provider, without it the provider can not be used to sign users in.
     */
    /**
     * Maps an auth result to a Backstage identity for the user.
     *
     * Set to `'email'` to use the default email-based sign in resolver, which will search
     * the catalog for a single user entity that has a matching `microsoft.com/email` annotation.
     */
    signIn?: {
        resolver: SignInResolver<OAuthResult>;
    };
};
/**
 * @public
 * @deprecated Use `providers.gitlab.create` instead
 */
declare const createGitlabProvider: (options?: {
    /**
     * The profile transformation function used to verify and convert the auth response
     * into the profile that will be presented to the user.
     */
    authHandler?: AuthHandler<OAuthResult> | undefined;
    /**
     * Configure sign-in for this provider, without it the provider can not be used to sign users in.
     */
    signIn?: {
        resolver: SignInResolver<OAuthResult>;
    } | undefined;
} | undefined) => AuthProviderFactory;

/**
 * @public
 * @deprecated This type has been inlined into the create method and will be removed.
 */
declare type GoogleProviderOptions = {
    /**
     * The profile transformation function used to verify and convert the auth response
     * into the profile that will be presented to the user.
     */
    authHandler?: AuthHandler<OAuthResult>;
    /**
     * Configure sign-in for this provider, without it the provider can not be used to sign users in.
     */
    signIn?: {
        /**
         * Maps an auth result to a Backstage identity for the user.
         */
        resolver: SignInResolver<OAuthResult>;
    };
};
/**
 * @public
 * @deprecated Use `providers.google.create` instead.
 */
declare const createGoogleProvider: (options?: {
    /**
     * The profile transformation function used to verify and convert the auth response
     * into the profile that will be presented to the user.
     */
    authHandler?: AuthHandler<OAuthResult> | undefined;
    /**
     * Configure sign-in for this provider, without it the provider can not be used to sign users in.
     */
    signIn?: {
        /**
         * Maps an auth result to a Backstage identity for the user.
         */
        resolver: SignInResolver<OAuthResult>;
    } | undefined;
} | undefined) => AuthProviderFactory;
/**
 * @public
 * @deprecated Use `providers.google.resolvers.emailMatchingUserEntityAnnotation()` instead.
 */
declare const googleEmailSignInResolver: SignInResolver<OAuthResult>;

/**
 * @public
 * @deprecated This type has been inlined into the create method and will be removed.
 */
declare type MicrosoftProviderOptions = {
    /**
     * The profile transformation function used to verify and convert the auth response
     * into the profile that will be presented to the user.
     */
    authHandler?: AuthHandler<OAuthResult>;
    /**
     * Configure sign-in for this provider, without it the provider can not be used to sign users in.
     */
    signIn?: {
        /**
         * Maps an auth result to a Backstage identity for the user.
         */
        resolver: SignInResolver<OAuthResult>;
    };
};
/**
 * @public
 * @deprecated Use `providers.microsoft.create` instead
 */
declare const createMicrosoftProvider: (options?: {
    /**
     * The profile transformation function used to verify and convert the auth response
     * into the profile that will be presented to the user.
     */
    authHandler?: AuthHandler<OAuthResult> | undefined;
    /**
     * Configure sign-in for this provider, without it the provider can not be used to sign users in.
     */
    signIn?: {
        /**
         * Maps an auth result to a Backstage identity for the user.
         */
        resolver: SignInResolver<OAuthResult>;
    } | undefined;
} | undefined) => AuthProviderFactory;
/**
 * @public
 * @deprecated Use `providers.microsoft.resolvers.emailMatchingUserEntityAnnotation()` instead.
 */
declare const microsoftEmailSignInResolver: SignInResolver<OAuthResult>;

/**
 * @public
 * @deprecated This type has been inlined into the create method and will be removed.
 */
declare type OAuth2ProviderOptions = {
    authHandler?: AuthHandler<OAuthResult>;
    signIn?: {
        resolver: SignInResolver<OAuthResult>;
    };
};
/**
 * @public
 * @deprecated Use `providers.oauth2.create` instead
 */
declare const createOAuth2Provider: (options?: {
    authHandler?: AuthHandler<OAuthResult> | undefined;
    signIn?: {
        resolver: SignInResolver<OAuthResult>;
    } | undefined;
} | undefined) => AuthProviderFactory;

/**
 * JWT header extraction result, containing the raw value and the parsed JWT
 * payload.
 *
 * @public
 */
declare type OAuth2ProxyResult<JWTPayload = {}> = {
    /**
     * The parsed payload of the `accessToken`. The token is only parsed, not verified.
     *
     * @deprecated Access through the `headers` instead. This will be removed in a future release.
     */
    fullProfile: JWTPayload;
    /**
     * The token received via the X-OAUTH2-PROXY-ID-TOKEN header. Will be an empty string
     * if the header is not set. Note the this is typically an OpenID Connect token.
     *
     * @deprecated Access through the `headers` instead. This will be removed in a future release.
     */
    accessToken: string;
    /**
     * The headers of the incoming request from the OAuth2 proxy. This will include
     * both the headers set by the client as well as the ones added by the OAuth2 proxy.
     * You should only trust the headers that are injected by the OAuth2 proxy.
     *
     * Useful headers to use to complete the sign-in are for example `x-forwarded-user`
     * and `x-forwarded-email`. See the OAuth2 proxy documentation for more information
     * about the available headers and how to enable them. In particular it is possible
     * to forward access and identity tokens, which can be user for additional verification
     * and lookups.
     */
    headers: IncomingHttpHeaders;
    /**
     * Provides convenient access to the request headers.
     *
     * This call is simply forwarded to `req.get(name)`.
     */
    getHeader(name: string): string | undefined;
};
/**
 * @public
 * @deprecated This type has been inlined into the create method and will be removed.
 */
declare type Oauth2ProxyProviderOptions<JWTPayload> = {
    /**
     * Configure an auth handler to generate a profile for the user.
     */
    authHandler: AuthHandler<OAuth2ProxyResult<JWTPayload>>;
    /**
     * Configure sign-in for this provider, without it the provider can not be used to sign users in.
     */
    signIn: {
        /**
         * Maps an auth result to a Backstage identity for the user.
         */
        resolver: SignInResolver<OAuth2ProxyResult<JWTPayload>>;
    };
};
/**
 * @public
 * @deprecated Use `providers.oauth2Proxy.create` instead
 */
declare const createOauth2ProxyProvider: (options: {
    /**
     * Configure an auth handler to generate a profile for the user.
     *
     * The default implementation uses the value of the `X-Forwarded-Preferred-Username`
     * header as the display name, falling back to `X-Forwarded-User`, and the value of
     * the `X-Forwarded-Email` header as the email address.
     */
    authHandler?: AuthHandler<OAuth2ProxyResult<unknown>> | undefined;
    /**
     * Configure sign-in for this provider, without it the provider can not be used to sign users in.
     */
    signIn: {
        /**
         * Maps an auth result to a Backstage identity for the user.
         */
        resolver: SignInResolver<OAuth2ProxyResult<unknown>>;
    };
}) => AuthProviderFactory;

/**
 * authentication result for the OIDC which includes the token set and user information (a profile response sent by OIDC server)
 * @public
 */
declare type OidcAuthResult = {
    tokenset: TokenSet;
    userinfo: UserinfoResponse;
};
/**
 * @public
 * @deprecated This type has been inlined into the create method and will be removed.
 */
declare type OidcProviderOptions = {
    authHandler?: AuthHandler<OidcAuthResult>;
    signIn?: {
        resolver: SignInResolver<OidcAuthResult>;
    };
};
/**
 * @public
 * @deprecated Use `providers.oidc.create` instead
 */
declare const createOidcProvider: (options?: {
    authHandler?: AuthHandler<OidcAuthResult> | undefined;
    signIn?: {
        resolver: SignInResolver<OidcAuthResult>;
    } | undefined;
} | undefined) => AuthProviderFactory;

/**
 * @public
 * @deprecated This type has been inlined into the create method and will be removed.
 */
declare type OktaProviderOptions = {
    /**
     * The profile transformation function used to verify and convert the auth response
     * into the profile that will be presented to the user.
     */
    authHandler?: AuthHandler<OAuthResult>;
    /**
     * Configure sign-in for this provider, without it the provider can not be used to sign users in.
     */
    signIn?: {
        /**
         * Maps an auth result to a Backstage identity for the user.
         */
        resolver: SignInResolver<OAuthResult>;
    };
};
/**
 * @public
 * @deprecated Use `providers.okta.create` instead
 */
declare const createOktaProvider: (options?: {
    /**
     * The profile transformation function used to verify and convert the auth response
     * into the profile that will be presented to the user.
     */
    authHandler?: AuthHandler<OAuthResult> | undefined;
    /**
     * Configure sign-in for this provider, without it the provider can not be used to sign users in.
     */
    signIn?: {
        /**
         * Maps an auth result to a Backstage identity for the user.
         */
        resolver: SignInResolver<OAuthResult>;
    } | undefined;
} | undefined) => AuthProviderFactory;
/**
 * @public
 * @deprecated Use `providers.okta.resolvers.emailMatchingUserEntityAnnotation()` instead.
 */
declare const oktaEmailSignInResolver: SignInResolver<OAuthResult>;

/**
 * @public
 * @deprecated This type has been inlined into the create method and will be removed.
 */
declare type OneLoginProviderOptions = {
    /**
     * The profile transformation function used to verify and convert the auth response
     * into the profile that will be presented to the user.
     */
    authHandler?: AuthHandler<OAuthResult>;
    /**
     * Configure sign-in for this provider, without it the provider can not be used to sign users in.
     */
    signIn?: {
        /**
         * Maps an auth result to a Backstage identity for the user.
         */
        resolver: SignInResolver<OAuthResult>;
    };
};
/**
 * @public
 * @deprecated Use `providers.onelogin.create` instead
 */
declare const createOneLoginProvider: (options?: {
    /**
     * The profile transformation function used to verify and convert the auth response
     * into the profile that will be presented to the user.
     */
    authHandler?: AuthHandler<OAuthResult> | undefined;
    /**
     * Configure sign-in for this provider, without it the provider can not be used to sign users in.
     */
    signIn?: {
        /**
         * Maps an auth result to a Backstage identity for the user.
         */
        resolver: SignInResolver<OAuthResult>;
    } | undefined;
} | undefined) => AuthProviderFactory;

/** @public */
declare type SamlAuthResult = {
    fullProfile: any;
};
/**
 * @public
 * @deprecated This type has been inlined into the create method and will be removed.
 */
declare type SamlProviderOptions = {
    /**
     * The profile transformation function used to verify and convert the auth response
     * into the profile that will be presented to the user.
     */
    authHandler?: AuthHandler<SamlAuthResult>;
    /**
     * Configure sign-in for this provider, without it the provider can not be used to sign users in.
     */
    signIn?: {
        /**
         * Maps an auth result to a Backstage identity for the user.
         */
        resolver: SignInResolver<SamlAuthResult>;
    };
};
/**
 * @public
 * @deprecated Use `providers.saml.create` instead
 */
declare const createSamlProvider: (options?: {
    /**
     * The profile transformation function used to verify and convert the auth response
     * into the profile that will be presented to the user.
     */
    authHandler?: AuthHandler<SamlAuthResult> | undefined;
    /**
     * Configure sign-in for this provider, without it the provider can not be used to sign users in.
     */
    signIn?: {
        /**
         * Maps an auth result to a Backstage identity for the user.
         */
        resolver: SignInResolver<SamlAuthResult>;
    } | undefined;
} | undefined) => AuthProviderFactory;
/**
 * @public
 * @deprecated Use `providers.saml.resolvers.nameIdMatchingUserEntityName()` instead.
 */
declare const samlNameIdEntityNameSignInResolver: SignInResolver<SamlAuthResult>;

/**
 * The data extracted from an IAP token.
 *
 * @public
 */
declare type GcpIapTokenInfo = {
    /**
     * The unique, stable identifier for the user.
     */
    sub: string;
    /**
     * User email address.
     */
    email: string;
    /**
     * Other fields.
     */
    [key: string]: JsonValue;
};
/**
 * The result of the initial auth challenge. This is the input to the auth
 * callbacks.
 *
 * @public
 */
declare type GcpIapResult = {
    /**
     * The data extracted from the IAP token header.
     */
    iapToken: GcpIapTokenInfo;
};
/**
 * @public
 * @deprecated This type has been inlined into the create method and will be removed.
 */
declare type GcpIapProviderOptions = {
    /**
     * The profile transformation function used to verify and convert the auth
     * response into the profile that will be presented to the user. The default
     * implementation just provides the authenticated email that the IAP
     * presented.
     */
    authHandler?: AuthHandler<GcpIapResult>;
    /**
     * Configures sign-in for this provider.
     */
    signIn: {
        /**
         * Maps an auth result to a Backstage identity for the user.
         */
        resolver: SignInResolver<GcpIapResult>;
    };
};

/**
 * @public
 * @deprecated Use `providers.gcpIap.create` instead
 */
declare const createGcpIapProvider: (options: {
    /**
     * The profile transformation function used to verify and convert the auth
     * response into the profile that will be presented to the user. The default
     * implementation just provides the authenticated email that the IAP
     * presented.
     */
    authHandler?: AuthHandler<GcpIapResult> | undefined;
    /**
     * Configures sign-in for this provider.
     */
    signIn: {
        /**
         * Maps an auth result to a Backstage identity for the user.
         */
        resolver: SignInResolver<GcpIapResult>;
    };
}) => AuthProviderFactory;

/**
 * All built-in auth provider integrations.
 *
 * @public
 */
declare const providers: Readonly<{
    atlassian: Readonly<{
        create: (options?: {
            authHandler?: AuthHandler<OAuthResult> | undefined;
            signIn?: {
                resolver: SignInResolver<OAuthResult>;
            } | undefined;
        } | undefined) => AuthProviderFactory;
        resolvers: never;
    }>;
    auth0: Readonly<{
        create: (options?: {
            authHandler?: AuthHandler<OAuthResult> | undefined;
            signIn?: {
                resolver: SignInResolver<OAuthResult>;
            } | undefined;
        } | undefined) => AuthProviderFactory;
        resolvers: never;
    }>;
    awsAlb: Readonly<{
        create: (options?: {
            authHandler?: AuthHandler<AwsAlbResult> | undefined;
            signIn: {
                resolver: SignInResolver<AwsAlbResult>;
            };
        } | undefined) => AuthProviderFactory;
        resolvers: never;
    }>;
    bitbucket: Readonly<{
        create: (options?: {
            authHandler?: AuthHandler<OAuthResult> | undefined;
            signIn?: {
                resolver: SignInResolver<OAuthResult>;
            } | undefined;
        } | undefined) => AuthProviderFactory;
        resolvers: Readonly<{
            usernameMatchingUserEntityAnnotation(): SignInResolver<OAuthResult>;
            userIdMatchingUserEntityAnnotation(): SignInResolver<OAuthResult>;
        }>;
    }>;
    gcpIap: Readonly<{
        create: (options: {
            authHandler?: AuthHandler<GcpIapResult> | undefined;
            signIn: {
                resolver: SignInResolver<GcpIapResult>;
            };
        }) => AuthProviderFactory;
        resolvers: never;
    }>;
    github: Readonly<{
        create: (options?: {
            authHandler?: AuthHandler<GithubOAuthResult> | undefined;
            signIn?: {
                resolver: SignInResolver<GithubOAuthResult>;
            } | undefined;
            stateEncoder?: StateEncoder | undefined;
        } | undefined) => AuthProviderFactory;
        resolvers: Readonly<{
            usernameMatchingUserEntityName: () => SignInResolver<GithubOAuthResult>;
        }>;
    }>;
    gitlab: Readonly<{
        create: (options?: {
            authHandler?: AuthHandler<OAuthResult> | undefined;
            signIn?: {
                resolver: SignInResolver<OAuthResult>;
            } | undefined;
        } | undefined) => AuthProviderFactory;
        resolvers: never;
    }>;
    google: Readonly<{
        create: (options?: {
            authHandler?: AuthHandler<OAuthResult> | undefined;
            signIn?: {
                resolver: SignInResolver<OAuthResult>;
            } | undefined;
        } | undefined) => AuthProviderFactory;
        resolvers: Readonly<{
            emailLocalPartMatchingUserEntityName: () => SignInResolver<unknown>;
            emailMatchingUserEntityProfileEmail: () => SignInResolver<unknown>;
            emailMatchingUserEntityAnnotation(): SignInResolver<OAuthResult>;
        }>;
    }>;
    microsoft: Readonly<{
        create: (options?: {
            authHandler?: AuthHandler<OAuthResult> | undefined;
            signIn?: {
                resolver: SignInResolver<OAuthResult>;
            } | undefined;
        } | undefined) => AuthProviderFactory;
        resolvers: Readonly<{
            emailLocalPartMatchingUserEntityName: () => SignInResolver<unknown>;
            emailMatchingUserEntityProfileEmail: () => SignInResolver<unknown>;
            emailMatchingUserEntityAnnotation(): SignInResolver<OAuthResult>;
        }>;
    }>;
    oauth2: Readonly<{
        create: (options?: {
            authHandler?: AuthHandler<OAuthResult> | undefined;
            signIn?: {
                resolver: SignInResolver<OAuthResult>;
            } | undefined;
        } | undefined) => AuthProviderFactory;
        resolvers: never;
    }>;
    oauth2Proxy: Readonly<{
        create: (options: {
            authHandler?: AuthHandler<OAuth2ProxyResult<unknown>> | undefined;
            signIn: {
                resolver: SignInResolver<OAuth2ProxyResult<unknown>>;
            };
        }) => AuthProviderFactory;
        resolvers: never;
    }>;
    oidc: Readonly<{
        create: (options?: {
            authHandler?: AuthHandler<OidcAuthResult> | undefined;
            signIn?: {
                resolver: SignInResolver<OidcAuthResult>;
            } | undefined;
        } | undefined) => AuthProviderFactory;
        resolvers: never;
    }>;
    okta: Readonly<{
        create: (options?: {
            authHandler?: AuthHandler<OAuthResult> | undefined;
            signIn?: {
                resolver: SignInResolver<OAuthResult>;
            } | undefined;
        } | undefined) => AuthProviderFactory;
        resolvers: Readonly<{
            emailLocalPartMatchingUserEntityName: () => SignInResolver<unknown>;
            emailMatchingUserEntityProfileEmail: () => SignInResolver<unknown>;
            emailMatchingUserEntityAnnotation(): SignInResolver<OAuthResult>;
        }>;
    }>;
    onelogin: Readonly<{
        create: (options?: {
            authHandler?: AuthHandler<OAuthResult> | undefined;
            signIn?: {
                resolver: SignInResolver<OAuthResult>;
            } | undefined;
        } | undefined) => AuthProviderFactory;
        resolvers: never;
    }>;
    saml: Readonly<{
        create: (options?: {
            authHandler?: AuthHandler<SamlAuthResult> | undefined;
            signIn?: {
                resolver: SignInResolver<SamlAuthResult>;
            } | undefined;
        } | undefined) => AuthProviderFactory;
        resolvers: Readonly<{
            nameIdMatchingUserEntityName(): SignInResolver<SamlAuthResult>;
        }>;
    }>;
}>;

declare const factories: {
    [providerId: string]: AuthProviderFactory;
};

/**
 * Parses a Backstage-issued token and decorates the
 * {@link @backstage/plugin-auth-node#BackstageIdentityResponse} with identity information sourced from the
 * token.
 *
 * @public
 */
declare function prepareBackstageIdentityResponse(result: BackstageSignInResult): BackstageIdentityResponse;

declare type ProviderFactories = {
    [s: string]: AuthProviderFactory;
};
interface RouterOptions {
    logger: Logger;
    database: PluginDatabaseManager;
    config: Config;
    discovery: PluginEndpointDiscovery;
    tokenManager: TokenManager;
    providerFactories?: ProviderFactories;
}
declare function createRouter(options: RouterOptions): Promise<express.Router>;
declare function createOriginFilter(config: Config): (origin: string) => boolean;

/**
 * Payload sent as a post message after the auth request is complete.
 * If successful then has a valid payload with Auth information else contains an error.
 */
declare type WebMessageResponse = {
    type: 'authorization_response';
    response: AuthResponse<unknown>;
} | {
    type: 'authorization_response';
    error: Error;
};

declare const postMessageResponse: (res: express.Response, appOrigin: string, response: WebMessageResponse) => void;
declare const ensuresXRequestedWith: (req: express.Request) => boolean;

/**
 * Uses the default ownership resolution logic to return an array
 * of entity refs that the provided entity claims ownership through.
 *
 * A reference to the entity itself will also be included in the returned array.
 *
 * @public
 */
declare function getDefaultOwnershipEntityRefs(entity: Entity): string[];

export { AtlassianAuthProvider, AtlassianProviderOptions, Auth0ProviderOptions, AuthHandler, AuthHandlerResult, AuthProviderConfig, AuthProviderFactory, AuthProviderFactoryOptions, AuthProviderRouteHandlers, AuthResolverCatalogUserQuery, AuthResolverContext, AuthResponse, AwsAlbProviderOptions, AwsAlbResult, BitbucketOAuthResult, BitbucketPassportProfile, BitbucketProviderOptions, CatalogIdentityClient, CookieConfigurer, GcpIapProviderOptions, GcpIapResult, GcpIapTokenInfo, GithubOAuthResult, GithubProviderOptions, GitlabProviderOptions, GoogleProviderOptions, MicrosoftProviderOptions, OAuth2ProviderOptions, OAuth2ProxyResult, OAuthAdapter, OAuthEnvironmentHandler, OAuthHandlers, OAuthProviderInfo, OAuthProviderOptions, OAuthRefreshRequest, OAuthResponse, OAuthResult, OAuthStartRequest, OAuthState, Oauth2ProxyProviderOptions, OidcAuthResult, OidcProviderOptions, OktaProviderOptions, OneLoginProviderOptions, ProfileInfo, RouterOptions, SamlAuthResult, SamlProviderOptions, SignInInfo, SignInResolver, StateEncoder, TokenIssuer, TokenParams, WebMessageResponse, bitbucketUserIdSignInResolver, bitbucketUsernameSignInResolver, createAtlassianProvider, createAuth0Provider, createAwsAlbProvider, createBitbucketProvider, createGcpIapProvider, createGithubProvider, createGitlabProvider, createGoogleProvider, createMicrosoftProvider, createOAuth2Provider, createOauth2ProxyProvider, createOidcProvider, createOktaProvider, createOneLoginProvider, createOriginFilter, createRouter, createSamlProvider, factories as defaultAuthProviderFactories, encodeState, ensuresXRequestedWith, getDefaultOwnershipEntityRefs, getEntityClaims, googleEmailSignInResolver, microsoftEmailSignInResolver, oktaEmailSignInResolver, postMessageResponse, prepareBackstageIdentityResponse, providers, readState, samlNameIdEntityNameSignInResolver, verifyNonce };
