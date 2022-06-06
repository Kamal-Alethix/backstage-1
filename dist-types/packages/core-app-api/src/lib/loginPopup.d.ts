/**
 * Options used to open a login popup.
 */
export declare type LoginPopupOptions = {
    /**
     * The URL that the auth popup should point to
     */
    url: string;
    /**
     * The name of the popup, as in second argument to window.open
     */
    name: string;
    /**
     * The origin of the final popup page that will post a message to this window.
     */
    origin: string;
    /**
     * The width of the popup in pixels, defaults to 500
     */
    width?: number;
    /**
     * The height of the popup in pixels, defaults to 700
     */
    height?: number;
};
/**
 * Show a popup pointing to a URL that starts an auth flow. Implementing the receiving
 * end of the postMessage mechanism outlined in https://tools.ietf.org/html/draft-sakimura-oauth-wmrm-00
 *
 * The redirect handler of the flow should use postMessage to communicate back
 * to the app window. The message posted to the app must match the AuthResult type.
 *
 * The returned promise resolves to the response of the message that was posted from the auth popup.
 */
export declare function showLoginPopup(options: LoginPopupOptions): Promise<any>;
