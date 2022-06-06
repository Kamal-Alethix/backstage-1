import { Config } from '@backstage/config';
import { AggregatedError, NotFoundInInstance } from '../types';
export declare type Options = {
    config: Config;
};
export declare class PeriskopApi {
    private readonly instances;
    constructor(options: Options);
    private getApiUrl;
    getErrors(instanceName: string, serviceName: string): Promise<AggregatedError[] | NotFoundInInstance>;
}
