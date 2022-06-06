import { AsyncState } from 'react-use/lib/useAsync';
import { BitriseBuildListResponse, BitriseQueryParams } from '../api/bitriseApi.model';
export declare const useBitriseBuilds: (appName: string, params: BitriseQueryParams) => AsyncState<BitriseBuildListResponse>;
