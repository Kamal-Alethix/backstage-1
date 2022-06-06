/// <reference types="react" />
import { ReleaseStats } from '../../contexts/ReleaseStatsContext';
interface RowCollapsedProps {
    releaseStat: ReleaseStats['releases']['0'];
}
export declare function RowCollapsed({ releaseStat }: RowCollapsedProps): JSX.Element;
export {};
