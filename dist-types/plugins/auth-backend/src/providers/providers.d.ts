/**
 * All built-in auth provider integrations.
 *
 * @public
 */
export declare const providers: Readonly<{
    atlassian: Readonly<{
        create: (options?: {
            authHandler?: import("./types").AuthHandler<import("..").OAuthResult> | undefined;
            signIn?: {
                resolver: import("./types").SignInResolver<import("..").OAuthResult>;
            } | undefined;
        } | undefined) => import("./types").AuthProviderFactory;
        resolvers: never;
    }>;
    auth0: Readonly<{
        create: (options?: {
            authHandler?: import("./types").AuthHandler<import("..").OAuthResult> | undefined;
            signIn?: {
                resolver: import("./types").SignInResolver<import("..").OAuthResult>;
            } | undefined;
        } | undefined) => import("./types").AuthProviderFactory;
        resolvers: never;
    }>;
    awsAlb: Readonly<{
        create: (options?: {
            authHandler?: import("./types").AuthHandler<import("./aws-alb/provider").AwsAlbResult> | undefined;
            signIn: {
                resolver: import("./types").SignInResolver<import("./aws-alb/provider").AwsAlbResult>;
            };
        } | undefined) => import("./types").AuthProviderFactory;
        resolvers: never;
    }>;
    bitbucket: Readonly<{
        create: (options?: {
            authHandler?: import("./types").AuthHandler<import("..").OAuthResult> | undefined;
            signIn?: {
                resolver: import("./types").SignInResolver<import("..").OAuthResult>;
            } | undefined;
        } | undefined) => import("./types").AuthProviderFactory;
        resolvers: Readonly<{
            usernameMatchingUserEntityAnnotation(): import("./types").SignInResolver<import("..").OAuthResult>;
            userIdMatchingUserEntityAnnotation(): import("./types").SignInResolver<import("..").OAuthResult>;
        }>;
    }>;
    gcpIap: Readonly<{
        create: (options: {
            authHandler?: import("./types").AuthHandler<import("./gcp-iap").GcpIapResult> | undefined;
            signIn: {
                resolver: import("./types").SignInResolver<import("./gcp-iap").GcpIapResult>;
            };
        }) => import("./types").AuthProviderFactory;
        resolvers: never;
    }>;
    github: Readonly<{
        create: (options?: {
            authHandler?: import("./types").AuthHandler<import("./github/provider").GithubOAuthResult> | undefined;
            signIn?: {
                resolver: import("./types").SignInResolver<import("./github/provider").GithubOAuthResult>;
            } | undefined;
            stateEncoder?: import("./types").StateEncoder | undefined;
        } | undefined) => import("./types").AuthProviderFactory;
        resolvers: Readonly<{
            usernameMatchingUserEntityName: () => import("./types").SignInResolver<import("./github/provider").GithubOAuthResult>;
        }>;
    }>;
    gitlab: Readonly<{
        create: (options?: {
            authHandler?: import("./types").AuthHandler<import("..").OAuthResult> | undefined;
            signIn?: {
                resolver: import("./types").SignInResolver<import("..").OAuthResult>;
            } | undefined;
        } | undefined) => import("./types").AuthProviderFactory;
        resolvers: never;
    }>;
    google: Readonly<{
        create: (options?: {
            authHandler?: import("./types").AuthHandler<import("..").OAuthResult> | undefined;
            signIn?: {
                resolver: import("./types").SignInResolver<import("..").OAuthResult>;
            } | undefined;
        } | undefined) => import("./types").AuthProviderFactory;
        resolvers: Readonly<{
            emailLocalPartMatchingUserEntityName: () => import("./types").SignInResolver<unknown>;
            emailMatchingUserEntityProfileEmail: () => import("./types").SignInResolver<unknown>;
            emailMatchingUserEntityAnnotation(): import("./types").SignInResolver<import("..").OAuthResult>;
        }>;
    }>;
    microsoft: Readonly<{
        create: (options?: {
            authHandler?: import("./types").AuthHandler<import("..").OAuthResult> | undefined;
            signIn?: {
                resolver: import("./types").SignInResolver<import("..").OAuthResult>;
            } | undefined;
        } | undefined) => import("./types").AuthProviderFactory;
        resolvers: Readonly<{
            emailLocalPartMatchingUserEntityName: () => import("./types").SignInResolver<unknown>;
            emailMatchingUserEntityProfileEmail: () => import("./types").SignInResolver<unknown>;
            emailMatchingUserEntityAnnotation(): import("./types").SignInResolver<import("..").OAuthResult>;
        }>;
    }>;
    oauth2: Readonly<{
        create: (options?: {
            authHandler?: import("./types").AuthHandler<import("..").OAuthResult> | undefined;
            signIn?: {
                resolver: import("./types").SignInResolver<import("..").OAuthResult>;
            } | undefined;
        } | undefined) => import("./types").AuthProviderFactory;
        resolvers: never;
    }>;
    oauth2Proxy: Readonly<{
        create: (options: {
            authHandler?: import("./types").AuthHandler<import("./oauth2-proxy/provider").OAuth2ProxyResult<unknown>> | undefined;
            signIn: {
                resolver: import("./types").SignInResolver<import("./oauth2-proxy/provider").OAuth2ProxyResult<unknown>>;
            };
        }) => import("./types").AuthProviderFactory;
        resolvers: never;
    }>;
    oidc: Readonly<{
        create: (options?: {
            authHandler?: import("./types").AuthHandler<import("./oidc/provider").OidcAuthResult> | undefined;
            signIn?: {
                resolver: import("./types").SignInResolver<import("./oidc/provider").OidcAuthResult>;
            } | undefined;
        } | undefined) => import("./types").AuthProviderFactory;
        resolvers: never;
    }>;
    okta: Readonly<{
        create: (options?: {
            authHandler?: import("./types").AuthHandler<import("..").OAuthResult> | undefined;
            signIn?: {
                resolver: import("./types").SignInResolver<import("..").OAuthResult>;
            } | undefined;
        } | undefined) => import("./types").AuthProviderFactory;
        resolvers: Readonly<{
            emailLocalPartMatchingUserEntityName: () => import("./types").SignInResolver<unknown>;
            emailMatchingUserEntityProfileEmail: () => import("./types").SignInResolver<unknown>;
            emailMatchingUserEntityAnnotation(): import("./types").SignInResolver<import("..").OAuthResult>;
        }>;
    }>;
    onelogin: Readonly<{
        create: (options?: {
            authHandler?: import("./types").AuthHandler<import("..").OAuthResult> | undefined;
            signIn?: {
                resolver: import("./types").SignInResolver<import("..").OAuthResult>;
            } | undefined;
        } | undefined) => import("./types").AuthProviderFactory;
        resolvers: never;
    }>;
    saml: Readonly<{
        create: (options?: {
            authHandler?: import("./types").AuthHandler<import("./saml/provider").SamlAuthResult> | undefined;
            signIn?: {
                resolver: import("./types").SignInResolver<import("./saml/provider").SamlAuthResult>;
            } | undefined;
        } | undefined) => import("./types").AuthProviderFactory;
        resolvers: Readonly<{
            nameIdMatchingUserEntityName(): import("./types").SignInResolver<import("./saml/provider").SamlAuthResult>;
        }>;
    }>;
}>;
