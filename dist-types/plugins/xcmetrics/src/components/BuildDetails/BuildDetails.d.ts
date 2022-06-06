/// <reference types="react" />
import { BuildResponse } from '../../api';
interface BuildDetailsProps {
    buildData: BuildResponse;
    showId?: boolean;
}
export declare const BuildDetails: ({ buildData: { build, targets, xcode }, showId, }: BuildDetailsProps) => JSX.Element;
declare type WithRequestProps = Omit<BuildDetailsProps, 'buildData'> & {
    buildId: string;
};
export declare const withRequest: (Component: typeof BuildDetails) => ({ buildId, ...props }: WithRequestProps) => JSX.Element;
export {};
