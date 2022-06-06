import { ProfileInfo } from '@backstage/core-plugin-api';
export declare const useUserProfile: () => {
    profile: ProfileInfo;
    displayName: string;
    loading: boolean;
};
