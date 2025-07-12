import { PrismaClient } from '@prisma/client';
/* UTILS IMPORT */
import loggerPromise from './logger';

class PrismaClientWrapper {
    private client: PrismaClient | null = null;
    private logger = loggerPromise;

    public async createPrismaClient(): Promise<void> {
        this.logger.info('Creating Prisma client.');
        this.client = new PrismaClient();

        try {
            await this.client.$connect();
            this.logger.info('Prisma client created successfully.');
        } catch (error) {
            this.logger.error(`Failed to create prisma client due to error. Error=${error}`);
            throw error; // Re-throw or handle as needed
        }
    }

    public getPrismaClient(): PrismaClient {
        if (!this.client) {
            throw new Error('Prisma client has not been initialized');
        }
        return this.client;
    }

    public async closePrismaClient(): Promise<void> {
        this.logger.info('Disconnecting prisma client');

        if (this.client) {
            try {
                await this.client.$disconnect();
                this.logger.info('Prisma client disconnected successfully.');
            } catch (error) {
                this.logger.error(`Failed to close prisma client due to error. Error=${error}`);
                throw error; // Re-throw or handle as needed
            } finally {
                this.client = null;
            }
        }
    }
}

// Singleton instance
export const prismaClient = new PrismaClientWrapper();
