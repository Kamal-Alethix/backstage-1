export interface ScmDetails {
    url?: string;
    displayName?: string;
    author?: string;
}
interface CommonBuild {
    timestamp: number;
    building: boolean;
    duration: number;
    result?: string;
    fullDisplayName: string;
    displayName: string;
    url: string;
    number: number;
}
export interface JenkinsBuild extends CommonBuild {
    actions: any;
}
/**
 * A build as presented by this plugin to the backstage jenkins plugin
 */
export interface BackstageBuild extends CommonBuild {
    source?: {
        branchName: string;
        displayName: string;
        url: string;
        commit: {
            hash: string;
        };
        author: string;
    };
    tests: {
        passed: number;
        skipped: number;
        failed: number;
        total: number;
        testUrl: string;
    };
    status: string;
}
export interface CommonProject {
    lastBuild: CommonBuild | null;
    displayName: string;
    fullDisplayName: string;
    fullName: string;
    inQueue: boolean;
}
export interface JenkinsProject extends CommonProject {
    lastBuild: JenkinsBuild | null;
    actions: object[];
}
export interface BackstageProject extends CommonProject {
    lastBuild: BackstageBuild | null;
    status: string;
}
export {};
