import React, { PropsWithChildren } from 'react';
declare type SecretsContextContents = {
    secrets: Record<string, string>;
    setSecrets: React.Dispatch<React.SetStateAction<Record<string, string>>>;
};
/**
 * The actual context object.
 */
export declare const SecretsContext: React.Context<SecretsContextContents | undefined>;
/**
 * The Context Provider that holds the state for the secrets.
 *
 * @alpha
 */
export declare const SecretsContextProvider: ({ children }: PropsWithChildren<{}>) => JSX.Element;
/**
 * Hook to access the secrets context.
 * @alpha
 */
export declare const useTemplateSecrets: () => {
    setSecret: (input: Record<string, string>) => void;
};
export {};
