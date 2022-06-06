import OAuth2Strategy from 'passport-oauth2';
import { Profile } from 'passport';
interface AtlassianStrategyOptions {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
    scope: string;
}
export default class AtlassianStrategy extends OAuth2Strategy {
    private readonly profileURL;
    constructor(options: AtlassianStrategyOptions, verify: OAuth2Strategy.VerifyFunction);
    authorizationParams(): {
        audience: string;
        prompt: string;
    };
    userProfile(accessToken: string, done: (err?: Error | null, profile?: any) => void): void;
    static parse(json: string): Profile;
}
export {};
