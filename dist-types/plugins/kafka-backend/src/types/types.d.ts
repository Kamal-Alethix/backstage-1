/// <reference types="node" />
import { ConnectionOptions } from 'tls';
export interface ClusterDetails {
    name: string;
    brokers: string[];
    ssl?: SslConfig;
    sasl?: SaslConfig;
}
export declare type SslConfig = ConnectionOptions | boolean;
export declare type SaslConfig = {
    mechanism: 'plain' | 'scram-sha-256' | 'scram-sha-512';
    username: string;
    password: string;
};
