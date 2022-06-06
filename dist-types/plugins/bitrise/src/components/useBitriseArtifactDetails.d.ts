import { BitriseBuildArtifactDetails } from '../api/bitriseApi.model';
export declare const useBitriseArtifactDetails: (appSlug: string, buildSlug: string, artifactSlug: string) => import("react-use/lib/useAsyncFn").AsyncState<BitriseBuildArtifactDetails | undefined>;
