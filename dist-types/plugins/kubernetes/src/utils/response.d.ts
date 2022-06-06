import { FetchResponse } from '@backstage/plugin-kubernetes-common';
import { GroupedResponses } from '../types/types';
export declare const groupResponses: (fetchResponse: FetchResponse[]) => GroupedResponses;
