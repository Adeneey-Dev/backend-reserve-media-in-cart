import { join } from 'path';
import { load } from 'js-yaml';
import { readFileSync } from 'fs';
/* INTERFACE IMPORT */
import { LogError } from '../types/index.interface';
import { AppConfig } from '../types/config.interface';

/**
 * Reads and parses YAML configuration file
 * @param filename Name of config file (without .yml extension)
 * @returns Parsed configuration object
 * @throws Error if file cannot be read or parsed
 */
export const loadConfig = <T = AppConfig>(filename: string): T => {
    try {
        const filePath: string = join(`${filename}.yaml`);
        const fileContents: string = readFileSync(filePath, 'utf8');

        return load(fileContents) as T;
    } catch (err) {
        const error = err as LogError;

        throw new Error(`Failed to load config file ${filename}: ${error.message}`);
    }
};

/**
 * Loads default application configuration
 * @returns Application configuration object
 */
export const getAppConfig = (): AppConfig => {
    return loadConfig<AppConfig>('config');
};
