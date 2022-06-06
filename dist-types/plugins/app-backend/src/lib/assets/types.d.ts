/// <reference types="node" />
export interface StaticAssetInput {
    path: string;
    content(): Promise<Buffer>;
}
export interface StaticAsset {
    path: string;
    content: Buffer;
    lastModifiedAt: Date;
}
export interface StaticAssetProvider {
    getAsset(path: string): Promise<StaticAsset | undefined>;
}
