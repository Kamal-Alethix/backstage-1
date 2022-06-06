import { Team } from '@backstage/plugin-azure-devops-common';
export declare function useAllTeams(): {
    teams?: Team[];
    loading: boolean;
    error?: Error;
};
