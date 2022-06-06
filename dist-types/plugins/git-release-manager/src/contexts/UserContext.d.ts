/// <reference types="react" />
interface User {
    username: string;
    email?: string;
}
export declare const UserContext: import("react").Context<{
    user: User;
} | undefined>;
export declare const useUserContext: () => {
    user: User;
};
export {};
