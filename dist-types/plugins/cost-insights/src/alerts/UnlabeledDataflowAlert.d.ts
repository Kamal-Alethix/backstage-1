/// <reference types="react" />
import { Alert, AlertStatus, UnlabeledDataflowData } from '../types';
/**
 * The alert below is an example of an Alert implementation; the CostInsightsApi permits returning
 * any implementation of the Alert type, so adopters can create their own. The CostInsightsApi
 * fetches alert data from the backend, then creates Alert classes with the data.
 */
export declare class UnlabeledDataflowAlert implements Alert {
    data: UnlabeledDataflowData;
    status?: AlertStatus;
    constructor(data: UnlabeledDataflowData);
    get url(): string;
    get title(): string;
    get subtitle(): string;
    get element(): JSX.Element;
}
