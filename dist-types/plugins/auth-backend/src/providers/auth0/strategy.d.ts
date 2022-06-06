import OAuth2Strategy from 'passport-oauth2';
export interface Auth0StrategyOptionsWithRequest {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
    domain: string;
    passReqToCallback: true;
}
export default class Auth0Strategy extends OAuth2Strategy {
    constructor(options: Auth0StrategyOptionsWithRequest, verify: OAuth2Strategy.VerifyFunctionWithRequest);
}
