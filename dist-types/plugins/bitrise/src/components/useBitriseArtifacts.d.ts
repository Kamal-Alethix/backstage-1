import { BitriseBuildArtifact } from '../api/bitriseApi.model';
export declare const useBitriseArtifacts: (appSlug: string, buildSlug: string) => import("react-use/lib/useAsyncFn").AsyncState<BitriseBuildArtifact[]>;
