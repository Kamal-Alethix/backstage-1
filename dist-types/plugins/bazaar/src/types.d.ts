export declare type Member = {
    itemId: number;
    userId: string;
    joinDate?: string;
    picture?: string;
};
export declare type Status = 'ongoing' | 'proposed';
export declare type Size = 'small' | 'medium' | 'large';
export declare type BazaarProject = {
    name: string;
    id: number;
    entityRef?: string;
    community: string;
    status: Status;
    description: string;
    updatedAt?: string;
    membersCount: number;
    size: Size;
    startDate?: string | null;
    endDate?: string | null;
    responsible: string;
};
export declare type FormValues = {
    name: string;
    description: string;
    community: string;
    status: string;
    size: Size;
    startDate?: string | null;
    endDate?: string | null;
    responsible: string;
};
