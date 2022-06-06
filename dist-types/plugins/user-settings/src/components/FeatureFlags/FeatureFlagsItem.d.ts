/// <reference types="react" />
import { FeatureFlag } from '@backstage/core-plugin-api';
declare type Props = {
    flag: FeatureFlag;
    enabled: boolean;
    toggleHandler: Function;
};
export declare const FlagItem: ({ flag, enabled, toggleHandler }: Props) => JSX.Element;
export {};
