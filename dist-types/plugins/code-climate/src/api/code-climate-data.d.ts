export declare type CodeClimateRepoData = {
    data: {
        id: string;
        type: string;
        attributes: {
            analysis_version: number;
            badge_token: string;
            branch: string;
            created_at: string;
            delegated_config_repo_id: string;
            diff_coverage_enforced: boolean;
            diff_coverage_threshold: number;
            enable_notifications: boolean;
            github_slug: string;
            human_name: string;
            last_activity_at: string;
            test_reporter_id: string | null;
            total_coverage_enforced: boolean;
            vcs_database_id: string;
            vcs_host: string;
            score: string | null;
        };
        relationships: {
            latest_default_branch_snapshot: {
                data: {
                    id: string;
                    type: string;
                };
            };
            latest_default_branch_test_report: {
                data: {
                    id: string;
                    type: string;
                };
            };
            account: {
                data: {
                    id: string;
                    type: string;
                };
            };
        };
        links: {
            self: string;
            services: string;
            web_coverage: string;
            web_issues: string;
            maintainability_badge: string;
            test_coverage_badge: string;
        };
        meta: {
            permissions: {
                admin: boolean;
            };
        };
    };
};
export declare type CodeClimateMaintainabilityData = {
    data: {
        id: string;
        type: string;
        attributes: {
            commit_sha: string;
            committed_at: string;
            created_at: string;
            lines_of_code: number;
            ratings: [
                {
                    path: string;
                    letter: string;
                    measure: {
                        value: number;
                        unit: string;
                        meta: {
                            remediation_time: {
                                value: number;
                                unit: string;
                            };
                            implementation_time: {
                                value: number;
                                unit: string;
                            };
                        };
                    };
                    pillar: string;
                }
            ];
            gpa: string | null;
            worker_version: number;
        };
        meta: {
            issues_count: number;
            measures: {
                remediation: {
                    value: number;
                    unit: string;
                };
                technical_debt_ratio: {
                    value: number;
                    unit: string;
                    meta: {
                        remediation_time: {
                            value: number;
                            unit: string;
                        };
                        implementation_time: {
                            value: number;
                            unit: string;
                        };
                    };
                };
            };
        };
    };
};
export declare type CodeClimateTestCoverageData = {
    data: {
        id: string;
        type: string;
        attributes: {
            branch: string;
            commit_sha: string;
            committed_at: string;
            covered_percent: number;
            lines_of_code: number;
            rating: {
                path: string;
                letter: string;
                measure: {
                    value: number;
                    unit: string;
                };
                pillar: string;
            };
            received_at: string;
            state: string;
        };
    };
};
export declare type CodeClimateIssuesData = {
    data: [
        {
            id: string;
            type: string;
            attributes: {
                categories: string[];
                check_name: string;
                constant_name: string;
                content: {
                    body: string;
                };
                description: string;
                engine_name: string;
                fingerprint: string;
                location: {
                    path: string;
                    end_line: number;
                    start_line: number;
                };
                other_locations: string[];
                remediation_points: number;
                severity: string;
            };
            meta: {
                permissions: {
                    manageable: boolean;
                };
            };
        }
    ];
    links: {
        self: string;
        next: string;
        last: string;
    };
    meta: {
        current_page: number;
        total_pages: number;
        total_count: number;
    };
};
export declare type CodeClimateData = {
    repoID: string;
    maintainability: {
        letter: string;
        value: string;
    };
    testCoverage: {
        letter: string;
        value: string;
    };
    numberOfCodeSmells: number;
    numberOfDuplication: number;
    numberOfOtherIssues: number;
};
export declare type CodeClimateApiError = {
    detail: string;
};
