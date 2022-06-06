import { CodeClimateData } from '../code-climate-data';
import { CodeClimateApi } from '../code-climate-api';
export declare const mockData: CodeClimateData;
export declare class MockCodeClimateApi implements CodeClimateApi {
    fetchData(): Promise<CodeClimateData>;
}
