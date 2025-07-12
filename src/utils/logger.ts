import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { format as dateFnsFormat } from 'date-fns';
import { join } from 'path';

// 1. Create your exact desired format
const customFormat = format.printf(({ level, message, timestamp }) => {
    const formattedTime = dateFnsFormat(new Date(), 'yyyy-MM-dd HH:mm:ss');
    return `[${formattedTime}] ${level.toUpperCase()}: ${message}`;
});

// 2. Configure transports (file + console)
const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        customFormat // Apply our custom format
    ),
    transports: [
        // File transport (your exact format)
        new DailyRotateFile({
            filename: join(__dirname, '../../logs/flashboord-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
        }),
        // Console transport (same format)
        new transports.Console(),
    ],
});

export default logger;
