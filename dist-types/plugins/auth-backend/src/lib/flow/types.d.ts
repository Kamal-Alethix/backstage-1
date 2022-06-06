import { AuthResponse } from '../../providers/types';
/**
 * Payload sent as a post message after the auth request is complete.
 * If successful then has a valid payload with Auth information else contains an error.
 */
export declare type WebMessageResponse = {
    type: 'authorization_response';
    response: AuthResponse<unknown>;
} | {
    type: 'authorization_response';
    error: Error;
};
