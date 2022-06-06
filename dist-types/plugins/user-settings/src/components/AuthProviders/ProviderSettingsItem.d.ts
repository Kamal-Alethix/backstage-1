/// <reference types="react" />
import { ApiRef, SessionApi, IconComponent } from '@backstage/core-plugin-api';
declare type Props = {
    title: string;
    description: string;
    icon: IconComponent;
    apiRef: ApiRef<SessionApi>;
};
export declare const ProviderSettingsItem: ({ title, description, icon: Icon, apiRef, }: Props) => JSX.Element;
export {};
