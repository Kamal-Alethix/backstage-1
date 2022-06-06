import { EscalationPolicyInfo, Incident, RoutingKey, Team, User } from '../components/types';
export declare const MOCKED_USER: User;
export declare const MOCKED_ON_CALL: {
    team: {
        name: string;
        slug: string;
    };
    oncallNow: {
        escalationPolicy: {
            name: string;
            slug: string;
        };
        users: {
            onCalluser: {
                username: string;
            };
        }[];
    }[];
}[];
export declare const MOCK_INCIDENT: Incident;
export declare const MOCK_TEAM: Team;
export declare const MOCK_ROUTING_KEY: RoutingKey;
export declare const MOCK_TEAM_NO_INCIDENTS: Team;
export declare const ESCALATION_POLICIES: EscalationPolicyInfo[];
