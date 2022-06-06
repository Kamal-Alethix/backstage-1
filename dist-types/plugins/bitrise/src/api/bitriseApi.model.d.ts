export declare type BitriseApp = {
    title: string;
    slug: string;
};
export declare type BitriseBuildArtifact = {
    slug: string;
    title: string;
    artifact_type: string;
};
export declare type BitriseBuildArtifactDetails = {
    slug: string;
    title: string;
    artifact_type: string;
    public_install_page_url: string;
    expiring_download_url: string;
};
export interface BitriseBuildResponseItem {
    abort_reason: string;
    branch: string;
    build_number: number;
    commit_hash: string;
    commit_message: string;
    commit_view_url: string;
    environment_prepare_finished_at: string;
    finished_at: string;
    is_on_hold: true;
    machine_type_id: string;
    original_build_params: string;
    pull_request_id: number;
    pull_request_target_branch: string;
    pull_request_view_url: string;
    slug: string;
    stack_identifier: string;
    started_on_worker_at: string;
    status: number;
    status_text: string;
    tag: string;
    triggered_at: string;
    triggered_by: string;
    triggered_workflow: string;
}
export declare enum BitriseBuildResultStatus {
    notFinished = 0,
    successful = 1,
    failed = 2,
    abortedWithFailure = 3,
    abortedWithSuccess = 4
}
export interface BitriseBuildResult {
    id: number;
    source: string;
    status: BitriseBuildResultStatus;
    statusText: string;
    buildSlug: string;
    message: string;
    workflow: string;
    commitHash: string;
    triggerTime: string;
    duration: string;
    appSlug: string;
}
export interface BitriseQueryParams {
    workflow: string;
    branch?: string;
    limit?: number;
    next?: string;
}
export interface BitriseBuildListResponse {
    data: BitriseBuildResult[];
    paging?: BitrisePagingResponse;
}
export interface BitrisePagingResponse {
    /**
     * Slug of the first build in the next page, `undefined` if there are no more results.
     */
    next: string;
    /**
     * Max number of elements per page (default: 50)
     */
    page_item_limit: number;
    total_item_count: number;
}
