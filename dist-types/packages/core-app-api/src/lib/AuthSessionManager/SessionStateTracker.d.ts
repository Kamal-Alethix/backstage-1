import { SessionState } from '@backstage/core-plugin-api';
import { Observable } from '@backstage/types';
export declare class SessionStateTracker {
    private readonly subject;
    private signedIn;
    setIsSignedIn(isSignedIn: boolean): void;
    sessionState$(): Observable<SessionState>;
}
