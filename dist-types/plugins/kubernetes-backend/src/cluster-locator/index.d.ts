import { Config } from '@backstage/config';
import { Duration } from 'luxon';
import { KubernetesClustersSupplier } from '../types/types';
export declare const getCombinedClusterSupplier: (rootConfig: Config, refreshInterval?: Duration | undefined) => KubernetesClustersSupplier;
