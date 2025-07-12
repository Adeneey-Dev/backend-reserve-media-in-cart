import { PoolConfig } from 'pg';

export interface DBConfig extends PoolConfig {
    host?: string;
    port?: number;
    user?: string;
    password?: string;
    database?: string;
}
