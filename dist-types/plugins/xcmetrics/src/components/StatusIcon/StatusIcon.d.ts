/// <reference types="react" />
import { BuildStatus } from '../../api';
interface StatusIconProps {
    buildStatus: BuildStatus;
}
export declare const StatusIcon: ({ buildStatus }: StatusIconProps) => JSX.Element;
export {};
