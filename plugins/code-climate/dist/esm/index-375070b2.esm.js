import { Duration } from 'luxon';
import humanizeDuration from 'humanize-duration';
import { createApiRef, createRouteRef, createPlugin, createApiFactory, discoveryApiRef, identityApiRef, createComponentExtension } from '@backstage/core-plugin-api';

var data$1 = {
	id: "6b8cc37a64b741dd9d516119",
	type: "snapshots",
	attributes: {
		commit_sha: "d670460b4b4aece5915caf5c68d12f560a9fe3e4",
		committed_at: "2022-01-14T15:17:29.311Z",
		created_at: "2022-01-31T10:07:40.415Z",
		lines_of_code: 8854,
		ratings: [
			{
				path: "/",
				letter: "B",
				measure: {
					value: 5.264879308188034,
					unit: "percent",
					meta: {
						remediation_time: {
							value: 7186.52,
							unit: "minute"
						},
						implementation_time: {
							value: 136499.2353922225,
							unit: "minute"
						}
					}
				},
				pillar: "Maintainability"
			}
		],
		gpa: null,
		worker_version: 69440
	},
	meta: {
		issues_count: 127,
		measures: {
			remediation: {
				value: 7186.52,
				unit: "minute"
			},
			technical_debt_ratio: {
				value: 5.264879308188034,
				unit: "percent",
				meta: {
					remediation_time: {
						value: 7186.52,
						unit: "minute"
					},
					implementation_time: {
						value: 136499.2353922225,
						unit: "minute"
					}
				}
			}
		}
	}
};
var maintainabilityMock = {
	data: data$1
};

var data = {
	id: "6b8cc37a64b741dd9d516119",
	type: "test_reports",
	attributes: {
		branch: "master",
		commit_sha: "d670460b4b4aece5915caf5c68d12f560a9fe3e4",
		committed_at: "2022-01-14T15:17:26.000Z",
		covered_percent: 88.41059602649007,
		lines_of_code: 8854,
		rating: {
			path: "/",
			letter: "B",
			measure: {
				value: 88.41059602649007,
				unit: "percent"
			},
			pillar: "Test Coverage"
		},
		received_at: "2022-01-14T15:25:38.352Z",
		state: "done"
	}
};
var testCoverageMock = {
	data: data
};

const maintainabilityData = maintainabilityMock.data.attributes.ratings[0];
const testCoverageData = testCoverageMock.data.attributes.rating;
const maintainabilityValue = {};
maintainabilityValue[maintainabilityData.measure.meta.implementation_time.unit] = maintainabilityData.measure.meta.implementation_time.value.toFixed();
const mockData = {
  repoID: "6b8cc37a64b741dd9d516119",
  maintainability: {
    letter: maintainabilityData.letter,
    value: humanizeDuration(Duration.fromObject(maintainabilityValue).toMillis(), { largest: 1 })
  },
  testCoverage: {
    letter: testCoverageData.letter,
    value: testCoverageData.measure.value.toFixed()
  },
  numberOfCodeSmells: 97,
  numberOfDuplication: 49,
  numberOfOtherIssues: 26
};
class MockCodeClimateApi {
  fetchData() {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockData), 800);
    });
  }
}

const codeClimateApiRef = createApiRef({
  id: "plugin.code-climate.service"
});

const pageQuery = encodeURIComponent("page[size]");
const statusFilter = encodeURIComponent("filter[status][$in][]");
const categoriesFilter = encodeURIComponent("filter[categories][$in][]");
const basicIssuesOptions = `${pageQuery}=1&${statusFilter}=open&${statusFilter}=confirmed`;
const codeSmellsQuery = `${basicIssuesOptions}&${categoriesFilter}=Complexity`;
const duplicationQuery = `${basicIssuesOptions}&${categoriesFilter}=Duplication`;
const otherIssuesQuery = `${basicIssuesOptions}&${categoriesFilter}=Bug%20Risk`;
class ProductionCodeClimateApi {
  constructor(discoveryApi) {
    this.discoveryApi = discoveryApi;
  }
  async fetchAllData(options) {
    const { apiUrl, repoID, snapshotID, testReportID } = options;
    const [
      maintainabilityResponse,
      testCoverageResponse,
      codeSmellsResponse,
      duplicationResponse,
      otherIssuesResponse
    ] = await Promise.all([
      await fetch(`${apiUrl}/repos/${repoID}/snapshots/${snapshotID}`),
      await fetch(`${apiUrl}/repos/${repoID}/test_reports/${testReportID}`),
      await fetch(`${apiUrl}/repos/${repoID}/snapshots/${snapshotID}/issues?${codeSmellsQuery}`),
      await fetch(`${apiUrl}/repos/${repoID}/snapshots/${snapshotID}/issues?${duplicationQuery}`),
      await fetch(`${apiUrl}/repos/${repoID}/snapshots/${snapshotID}/issues?${otherIssuesQuery}`)
    ]);
    if (!maintainabilityResponse.ok || !testCoverageResponse.ok || !codeSmellsResponse.ok || !duplicationResponse.ok || !otherIssuesResponse.ok) {
      throw new Error("Failed fetching Code Climate info");
    }
    const maintainabilityData = (await maintainabilityResponse.json()).data.attributes.ratings[0];
    const testCoverageData = (await testCoverageResponse.json()).data.attributes.rating;
    const codeSmellsData = (await codeSmellsResponse.json()).meta.total_count;
    const duplicationData = (await duplicationResponse.json()).meta.total_count;
    const otherIssuesData = (await otherIssuesResponse.json()).meta.total_count;
    return [
      maintainabilityData,
      testCoverageData,
      codeSmellsData,
      duplicationData,
      otherIssuesData
    ];
  }
  async fetchData(repoID) {
    if (!repoID) {
      throw new Error("No Repo id found");
    }
    const apiUrl = `${await this.discoveryApi.getBaseUrl("proxy")}/codeclimate/api`;
    const repoResponse = await fetch(`${apiUrl}/repos/${repoID}`);
    if (!repoResponse.ok) {
      throw new Error("Failed fetching Code Climate info");
    }
    const repoData = (await repoResponse.json()).data;
    const snapshotID = repoData.relationships.latest_default_branch_snapshot.data.id;
    const testReportID = repoData.relationships.latest_default_branch_test_report.data.id;
    const [
      maintainabilityData,
      testCoverageData,
      codeSmellsData,
      duplicationData,
      otherIssuesData
    ] = await this.fetchAllData({
      apiUrl,
      repoID,
      snapshotID,
      testReportID
    });
    const maintainabilityValue = {};
    maintainabilityValue[maintainabilityData.measure.meta.implementation_time.unit] = maintainabilityData.measure.meta.implementation_time.value.toFixed();
    return {
      repoID,
      maintainability: {
        letter: maintainabilityData.letter,
        value: humanizeDuration(Duration.fromObject(maintainabilityValue).toMillis(), { largest: 1 })
      },
      testCoverage: {
        letter: testCoverageData.letter,
        value: testCoverageData.measure.value.toFixed()
      },
      numberOfCodeSmells: codeSmellsData,
      numberOfDuplication: duplicationData,
      numberOfOtherIssues: otherIssuesData
    };
  }
}

const CODECLIMATE_REPO_ID_ANNOTATION = "codeclimate.com/repo-id";
const rootRouteRef = createRouteRef({
  id: "code-climate"
});
const codeClimatePlugin = createPlugin({
  id: "code-climate",
  apis: [
    createApiFactory({
      api: codeClimateApiRef,
      deps: {
        discoveryApi: discoveryApiRef,
        identityApi: identityApiRef
      },
      factory: ({ discoveryApi }) => new ProductionCodeClimateApi(discoveryApi)
    })
  ],
  routes: {
    root: rootRouteRef
  }
});
const EntityCodeClimateCard = codeClimatePlugin.provide(createComponentExtension({
  name: "EntityCodeClimateCard",
  component: {
    lazy: () => import('./index-04844540.esm.js').then((m) => m.CodeClimateCard)
  }
}));

export { CODECLIMATE_REPO_ID_ANNOTATION as C, EntityCodeClimateCard as E, MockCodeClimateApi as M, ProductionCodeClimateApi as P, codeClimatePlugin as a, codeClimateApiRef as c, mockData as m };
//# sourceMappingURL=index-375070b2.esm.js.map
