import { Gitlab } from '@gitbeaker/browser';
import limiterFactory from 'p-limit';
import { getEntitySourceLocation } from '@backstage/catalog-model';

const statusMap = {
  manual: "unknown",
  created: "enqueued",
  waiting_for_resource: "stalled",
  preparing: "unknown",
  pending: "scheduled",
  running: "running",
  success: "succeeded",
  failed: "failed",
  canceled: "aborted",
  skipped: "aborted",
  scheduled: "scheduled"
};
const triggerReasonMap = {
  push: "scm",
  trigger: "manual",
  merge_request_event: "scm",
  schedule: "internal"
};
function pipelinesToBuilds(pipelines) {
  return pipelines.map((pipeline) => {
    var _a;
    return {
      id: pipeline.id.toString(),
      status: statusMap[pipeline.status],
      branchType: "master",
      duration: 0,
      requestedAt: new Date(pipeline.created_at),
      triggeredBy: (_a = triggerReasonMap[pipeline.source]) != null ? _a : "other",
      stages: []
    };
  });
}
function jobsToStages(jobs) {
  return jobs.map((job) => {
    const status = statusMap[job.status] ? statusMap[job.status] : "unknown";
    const duration = job.duration ? job.duration * 1e3 : 0;
    return {
      name: job.stage,
      status,
      duration,
      stages: job.name !== job.stage ? [
        {
          name: job.name,
          status,
          duration
        }
      ] : []
    };
  });
}

var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var _gitLabAuthApi;
const _CicdStatisticsApiGitlab = class {
  constructor(gitLabAuthApi) {
    __privateAdd(this, _gitLabAuthApi, void 0);
    __privateSet(this, _gitLabAuthApi, gitLabAuthApi);
  }
  async createGitlabApi(entity, scopes) {
    const entityInfo = getEntitySourceLocation(entity);
    const url = new URL(entityInfo.target);
    const owner = url.pathname.split("/-/blob/")[0];
    const oauthToken = await __privateGet(this, _gitLabAuthApi).getAccessToken(scopes);
    return {
      api: new Gitlab({
        host: `https://${url.host}`,
        oauthToken
      }),
      owner: owner.substring(1)
    };
  }
  static async updateBuildWithStages(gitbeaker, owner, build) {
    const jobs = await gitbeaker.Jobs.showPipelineJobs(owner, parseInt(build.id, 10));
    const stages = jobsToStages(jobs);
    return stages;
  }
  static async getDurationOfBuild(gitbeaker, owner, build) {
    const pipeline = await gitbeaker.Pipelines.show(owner, parseInt(build.id, 10));
    return parseInt(pipeline.duration, 10) * 1e3;
  }
  static async getDefaultBranch(gitbeaker, owner) {
    var _a;
    const branches = await gitbeaker.Branches.all(owner);
    return (_a = branches.find((branch) => branch.default)) == null ? void 0 : _a.name;
  }
  async fetchBuilds(options) {
    const {
      entity,
      updateProgress,
      timeFrom,
      timeTo,
      filterStatus = ["all"],
      filterType = "all"
    } = options;
    const { api, owner } = await this.createGitlabApi(entity, ["read_api"]);
    updateProgress(0, 0, 0);
    const branch = filterType === "master" ? await _CicdStatisticsApiGitlab.getDefaultBranch(api, owner) : void 0;
    const pipelines = await api.Pipelines.all(owner, {
      perPage: 25,
      updated_after: timeFrom.toISOString(),
      updated_before: timeTo.toISOString(),
      ref: branch
    });
    const limiter = limiterFactory(10);
    const builds = pipelinesToBuilds(pipelines).map(async (build) => ({
      ...build,
      duration: await limiter(() => _CicdStatisticsApiGitlab.getDurationOfBuild(api, owner, build)),
      stages: await limiter(() => _CicdStatisticsApiGitlab.updateBuildWithStages(api, owner, build))
    }));
    const promisedBuilds = (await Promise.all(builds)).filter((b) => filterStatus.includes(b.status));
    return { builds: promisedBuilds };
  }
  async getConfiguration() {
    return {
      availableStatuses: [
        "succeeded",
        "failed",
        "enqueued",
        "running",
        "aborted",
        "stalled",
        "expired",
        "unknown"
      ]
    };
  }
};
let CicdStatisticsApiGitlab = _CicdStatisticsApiGitlab;
_gitLabAuthApi = new WeakMap();

export { CicdStatisticsApiGitlab };
//# sourceMappingURL=index.esm.js.map
