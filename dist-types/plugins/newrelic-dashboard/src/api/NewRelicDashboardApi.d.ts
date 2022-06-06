import { DashboardEntity } from '../types/DashboardEntity';
import { DashboardSnapshot } from '../types/DashboardSnapshot';
import { SnapshotDetails } from '../types/SnapshotDetails';
export interface DashboardEntitySummary {
    getDashboardEntity: DashboardEntity;
}
export interface DashboardSnapshotSummary {
    getDashboardSnapshot: DashboardSnapshot;
}
export interface SnapshotDetailsSummary {
    getSnapshotDetails: SnapshotDetails[];
}
export declare const newRelicDashboardApiRef: import("@backstage/core-plugin-api").ApiRef<NewRelicDashboardApi>;
export declare type NewRelicDashboardApi = {
    getDashboardEntity(guid: string): Promise<DashboardEntitySummary | undefined>;
    getDashboardSnapshot(guid: string, duration: number): Promise<DashboardSnapshotSummary | undefined>;
};
