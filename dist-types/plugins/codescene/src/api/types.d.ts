export interface Project {
    id: number;
    name: string;
    description?: string;
    project_owner?: string;
}
export interface Analysis {
    id: number;
    name: string;
    project_id: number;
    description?: string;
    readable_analysis_time: string;
    summary: Summary;
    file_summary: FileSummary[];
    high_level_metrics: HighLevelMetrics;
}
export interface Summary {
    unique_issue_ids: number;
    issues_filtered_as_outliers: number;
    entities: number;
    commits_with_issue_ids: number;
    authors_count: number;
    active_authors_count: number;
    issues_with_cycle_time: number;
    commits: number;
    issue_ids_matched_to_issues: number;
    issues_classed_as_defects: number;
    issues_with_cost: number;
}
export interface FileSummary {
    language: string;
    number_of_files: number;
    blank: number;
    comment: number;
    code: number;
}
export interface HighLevelMetrics {
    current_score: number;
    month_score: number;
    year_score: number;
    active_developers: number;
    lines_of_code: number;
    system_mastery: number;
    code_health_weighted_average_last_month?: number;
    code_health_month_worst_performer?: number;
    code_health_weighted_average_current?: number;
    hotspots_code_health_now_weighted_average?: number;
    code_health_weighted_average_last_year?: number;
    code_health_year_worst_performer?: number;
    hotspots_code_health_month_weighted_average?: number;
    hotspots_code_health_year_weighted_average?: number;
    code_health_now_worst_performer?: number;
}
export interface FetchProjectsResponse {
    page: number;
    max_pages: number;
    projects: Project[];
}
export interface FetchAnalysesResponse {
    page: number;
    max_pages: number;
    analyses: Analysis[];
}
