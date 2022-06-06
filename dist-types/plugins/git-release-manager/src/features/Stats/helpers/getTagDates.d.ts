import { GitReleaseApi } from '../../../api/GitReleaseClient';
import { Project } from '../../../contexts/ProjectContext';
interface GetTagDates {
    pluginApiClient: GitReleaseApi;
    project: Project;
    startTag: {
        tagSha: string;
        tagType: 'tag' | 'commit';
    };
    endTag?: {
        tagSha: string;
        tagType: 'tag' | 'commit';
    };
}
export declare const getTagDates: ({ pluginApiClient, project, startTag, endTag, }: GetTagDates) => Promise<{
    startDate: string | undefined;
    endDate: string | undefined;
}>;
export {};
