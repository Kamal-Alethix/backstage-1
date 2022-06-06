export interface GoCdApiError {
    message: string;
}
export interface PipelineHistory {
    _links: Links;
    pipelines: Pipeline[];
}
export interface Links {
    next: Next;
}
export interface Next {
    href: string;
}
export interface Pipeline {
    name: string;
    counter: number;
    label: string;
    natural_order?: number;
    can_run?: boolean;
    preparing_to_schedule?: boolean;
    comment: string | null;
    scheduled_date?: number;
    build_cause?: BuildCause;
    stages: Stage[];
}
export interface BuildCause {
    trigger_message: string;
    trigger_forced: boolean;
    approver: string;
    material_revisions: MaterialRevision[];
}
export interface MaterialRevision {
    changed: boolean;
    material: Material;
    modifications: Modification[];
}
export interface Material {
    name: string;
    fingerprint: string;
    type: string;
    description: string;
}
export interface Modification {
    revision: string;
    modified_time: number;
    user_name: string;
    comment: string | null;
    email_address: string | null;
}
export interface Stage {
    result?: string;
    status: string;
    rerun_of_counter?: number | null;
    name: string;
    counter: string;
    scheduled: boolean;
    approval_type?: string | null;
    approved_by?: string | null;
    operate_permission?: boolean;
    can_run?: boolean;
    jobs: Job[];
}
export interface Job {
    name: string;
    scheduled_date?: number;
    state: string;
    result: string;
}
export declare enum GoCdBuildResultStatus {
    running = 0,
    successful = 1,
    warning = 2,
    aborted = 3,
    error = 4,
    pending = 5
}
export declare const toBuildResultStatus: (status: string) => GoCdBuildResultStatus;
export interface GoCdBuildStageResult {
    status: GoCdBuildResultStatus;
    text: string;
}
export interface GoCdBuildResult {
    id: number;
    source: string;
    stages: GoCdBuildStageResult[];
    buildSlug: string;
    message: string;
    pipeline: string;
    author: string | undefined;
    commitHash: string;
    triggerTime: number | undefined;
}
