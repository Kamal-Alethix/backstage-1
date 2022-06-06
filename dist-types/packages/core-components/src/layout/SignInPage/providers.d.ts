/// <reference types="react" />
import { SignInPageProps } from '@backstage/core-plugin-api';
import { IdentityProviders, SignInProvider, SignInProviderConfig } from './types';
export declare type SignInProviderType = {
    [key: string]: {
        components: SignInProvider;
        id: string;
        config?: SignInProviderConfig;
    };
};
export declare function getSignInProviders(identityProviders: IdentityProviders): SignInProviderType;
export declare const useSignInProviders: (providers: SignInProviderType, onSignInSuccess: SignInPageProps['onSignInSuccess']) => (boolean | JSX.Element[])[];
