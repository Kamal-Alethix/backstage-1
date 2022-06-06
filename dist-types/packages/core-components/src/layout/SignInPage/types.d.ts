import { ComponentType } from 'react';
import { SignInPageProps, ApiHolder, ApiRef, ProfileInfoApi, BackstageIdentityApi, SessionApi, IdentityApi } from '@backstage/core-plugin-api';
export declare type SignInProviderConfig = {
    id: string;
    title: string;
    message: string;
    apiRef: ApiRef<ProfileInfoApi & BackstageIdentityApi & SessionApi>;
};
/** @public **/
export declare type IdentityProviders = ('guest' | 'custom' | SignInProviderConfig)[];
export declare type ProviderComponent = ComponentType<SignInPageProps & {
    config: SignInProviderConfig;
}>;
export declare type ProviderLoader = (apis: ApiHolder, apiRef: ApiRef<ProfileInfoApi & BackstageIdentityApi & SessionApi>) => Promise<IdentityApi | undefined>;
export declare type SignInProvider = {
    Component: ProviderComponent;
    loader: ProviderLoader;
};
