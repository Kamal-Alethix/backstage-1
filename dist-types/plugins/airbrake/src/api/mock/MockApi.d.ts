import { Groups } from '../airbrakeGroups';
import { AirbrakeApi } from '../AirbrakeApi';
export declare class MockAirbrakeApi implements AirbrakeApi {
    waitTimeInMillis: number;
    constructor(waitTimeInMillis?: number);
    fetchGroups(): Promise<Groups>;
}
