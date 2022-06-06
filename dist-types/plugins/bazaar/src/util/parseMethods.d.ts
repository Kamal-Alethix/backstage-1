import { BazaarProject, Member } from '../types';
export declare const parseBazaarProject: (metadata: any) => BazaarProject;
export declare const parseMember: (member: any) => Member;
export declare const parseBazaarResponse: (response: any) => Promise<BazaarProject | null>;
