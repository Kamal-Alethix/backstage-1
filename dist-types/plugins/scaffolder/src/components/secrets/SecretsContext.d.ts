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
 * @public
 */
export declare const SecretsContextProvider: ({ children }: PropsWithChildren<{}>) => JSX.Element;
/**
 * The return type from the useTemplateSecrets hook.
 * @public
 */
export interface ScaffolderUseTemplateSecrets {
    setSecrets: (input: Record<string, string>) => void;
}
/**
 * Hook to access the secrets context.
 * @public
 */
export declare const useTemplateSecrets: () => ScaffolderUseTemplateSecrets;
export {};
