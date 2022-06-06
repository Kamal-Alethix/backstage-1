/// <reference types="react" />
import { SignInPageProps } from '@backstage/core-plugin-api';
import { IdentityProviders, SignInProviderConfig } from './types';
declare type MultiSignInPageProps = SignInPageProps & {
    providers: IdentityProviders;
    title?: string;
    align?: 'center' | 'left';
};
declare type SingleSignInPageProps = SignInPageProps & {
    provider: SignInProviderConfig;
    auto?: boolean;
};
export declare type Props = MultiSignInPageProps | SingleSignInPageProps;
export declare const MultiSignInPage: ({ onSignInSuccess, providers, title, align, }: MultiSignInPageProps) => JSX.Element;
export declare const SingleSignInPage: ({ provider, auto, onSignInSuccess, }: SingleSignInPageProps) => JSX.Element;
export declare function SignInPage(props: Props): JSX.Element;
export {};
