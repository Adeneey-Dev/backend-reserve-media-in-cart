import express, { Express } from 'express';
/* UTILS IMPORT */
import loggerPromise from './utils/logger';
import { getAppConfig } from './utils/config';
import { prismaClient } from './utils/database';
/* ROUTER IMPORT */
import allRoutes from './routes/index';

const app: Express = express();

const config = getAppConfig();

const startServer: () => Promise<void> = async (): Promise<void> => {
    try {
        const logger = loggerPromise;

        await prismaClient.createPrismaClient();

        app.use((req, res, next) => {
            logger.info(`${req.method} ${req.url}`);

            next();
        });

        app.use(express.json());
        app.use(express.urlencoded({ extended: false }));

        app.use(
            (
                err: Error,
                _req: express.Request,
                res: express.Response,
                _next: express.NextFunction
            ) => {
                logger.error(err.stack);

                res.status(500).send('Something broke!');
            }
        );

        app.use('/', allRoutes);

        app.listen(config.port, () => {
            logger.info(`Server is running on http://localhost:${config.port}`);
        });
    } catch (err) {
        console.error('Failed to initialize logger:', err);
        process.exit(1);
    }
};

startServer();

export default app;
