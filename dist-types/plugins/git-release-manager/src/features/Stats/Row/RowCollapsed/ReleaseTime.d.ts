/// <reference types="react" />
import { ReleaseStats } from '../../contexts/ReleaseStatsContext';
interface ReleaseTimeProps {
    releaseStat: ReleaseStats['releases']['0'];
}
export declare function ReleaseTime({ releaseStat }: ReleaseTimeProps): JSX.Element;
export {};
