import { AuthConnector } from './types';
export declare const mockAccessToken = "mock-access-token";
declare type MockSession = {
    accessToken: string;
    expiresAt: Date;
    scopes: string;
};
export declare class MockAuthConnector implements AuthConnector<MockSession> {
    private readonly mockSession;
    constructor(mockSession?: MockSession);
    createSession(): Promise<MockSession>;
    refreshSession(): Promise<MockSession>;
    removeSession(): Promise<void>;
}
export {};
