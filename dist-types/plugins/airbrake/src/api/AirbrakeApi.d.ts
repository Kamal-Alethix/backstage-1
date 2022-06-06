import { Groups } from './airbrakeGroups';
export declare const airbrakeApiRef: import("@backstage/core-plugin-api").ApiRef<AirbrakeApi>;
export interface AirbrakeApi {
    fetchGroups(projectId: string): Promise<Groups>;
}
