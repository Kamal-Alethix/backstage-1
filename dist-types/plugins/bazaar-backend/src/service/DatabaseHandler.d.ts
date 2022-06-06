import { Knex } from 'knex';
declare type Options = {
    database: Knex;
};
export declare class DatabaseHandler {
    static create(options: Options): Promise<DatabaseHandler>;
    private readonly database;
    private constructor();
    private columns;
    getMembers(id: string): Promise<any[]>;
    addMember(id: number, userId: string, picture?: string): Promise<void>;
    deleteMember(id: number, userId: string): Promise<number>;
    getMetadataById(id: number): Promise<any[]>;
    getMetadataByRef(entityRef: string): Promise<any[]>;
    insertMetadata(bazaarProject: any): Promise<void>;
    updateMetadata(bazaarProject: any): Promise<number>;
    deleteMetadata(id: number): Promise<number>;
    getProjects(): Promise<any[]>;
}
export {};
