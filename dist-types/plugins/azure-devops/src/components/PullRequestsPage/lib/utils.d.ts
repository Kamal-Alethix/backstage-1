import { DashboardPullRequest, Reviewer } from '@backstage/plugin-azure-devops-common';
import { Filter } from './filters';
import { PullRequestColumnConfig, PullRequestGroup, PullRequestGroupConfig } from './types';
/**
 * Filters a reviewer based on vote status and if the reviewer is required.
 * @param reviewer - a reviewer to filter.
 * @returns whether or not to filter the `reviewer`.
 */
export declare function reviewerFilter(reviewer: Reviewer): boolean;
/**
 * Removes values from the provided array and returns them.
 * @param arr - the array to extract values from.
 * @param filter - a filter used to extract values from the provided array.
 * @returns the values that were extracted from the array.
 *
 * @example
 * ```ts
 * const numbers = [1, 2, 3, 4, 5, 6];
 * const numberFilter = (num: number): boolean => num > 3;
 * const extractedNumbers = arrayExtract(numbers, numberFilter);
 * console.log(numbers); // [1, 2, 3]
 * console.log(extractedNumbers); // [4, 5, 6]
 * ```
 *
 * @example
 * ```ts
 * const numbers = [1, 2, 3, 4, 5, 6];
 * const numberFilter = (num: number): boolean => num % 2 === 0;
 * const extractedNumbers = arrayExtract(numbers, numberFilter);
 * console.log(numbers); // [1, 3, 5]
 * console.log(extractedNumbers); // [2, 4, 6]
 * ```
 */
export declare function arrayExtract<T>(arr: T[], filter: (value: T) => unknown): T[];
/**
 * Creates groups of pull requests based on a list of `PullRequestGroupConfig`.
 * @param pullRequests - all pull requests to be split up into groups.
 * @param configs - the config used for splitting up the pull request groups.
 * @returns a list of pull request groups.
 */
export declare function getPullRequestGroups(pullRequests: DashboardPullRequest[] | undefined, configs: PullRequestGroupConfig[]): PullRequestGroup[] | undefined;
export declare function getPullRequestGroupConfigs(columnConfigs: PullRequestColumnConfig[], filterProcessor: (filters: Filter[]) => Filter[]): PullRequestGroupConfig[];
