/// <reference types="react" />
import { ReleaseStats } from '../contexts/ReleaseStatsContext';
interface RowProps {
    baseVersion: string;
    releaseStat: ReleaseStats['releases']['0'];
}
export declare function Row({ baseVersion, releaseStat }: RowProps): JSX.Element;
export {};
