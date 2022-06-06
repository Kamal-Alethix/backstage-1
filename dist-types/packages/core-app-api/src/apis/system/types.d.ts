import { ApiFactory, ApiRef } from '@backstage/core-plugin-api';
/**
 * @public
 */
export declare type ApiFactoryHolder = {
    get<T>(api: ApiRef<T>): ApiFactory<T, T, {
        [key in string]: unknown;
    }> | undefined;
};
