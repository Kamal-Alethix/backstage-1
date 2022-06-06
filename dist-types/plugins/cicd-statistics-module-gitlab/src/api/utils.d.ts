import { Build, Stage } from '@backstage/plugin-cicd-statistics';
import { Types } from '@gitbeaker/core';
/**
 * Takes the Pipeline object from Gitlab and transforms it to the Build object
 *
 * @param pipelines - Pipeline object that gets returned from Gitlab
 *
 * @public
 */
export declare function pipelinesToBuilds(pipelines: Array<Types.PipelineSchema>): Build[];
/**
 * Takes the Job object from Gitlab and transforms it to the Stage object
 *
 * @param jobs - Job object that gets returned from Gitlab
 *
 * @public
 *
 * @remarks
 *
 * The Gitlab API can only return the job (sub-stage) of a pipeline and not a whole stage
 * The job does return from which stage it is
 * So, for the stage name we use the parent stage name and in the sub-stages we add the current job
 * In the end the cicd-statistics plugin will calculate the right durations for each stage
 *
 * Furthermore, we don't add the job to the sub-stage if it is has the same name as the parent stage
 * We then assume that the stage has no sub-stages
 */
export declare function jobsToStages(jobs: Array<Types.JobSchema>): Stage[];
