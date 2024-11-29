import { createLogger, format, transports } from "winston";

const { combine, timestamp, printf, colorize } = format;

// Custom log format
const logFormat = printf(({ level, message, timestamp }) => {
  return `[${timestamp}] ${level}: ${message}`;
});

// Create logger instance
const logger = createLogger({
  level: "info", // Default logging level
  format: combine(
    colorize(), // Adds color to the log level
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    logFormat
  ),
  transports: [
    // Write logs to the console
    new transports.Console(),

    // Write logs to a file (error level only)
    new transports.File({ filename: "logs/error.log", level: "error" }),

    // Write all logs to a general log file
    new transports.File({ filename: "logs/combined.log" }),
  ],
});

// Stream for use with morgan (optional, for HTTP request logging)
export const stream = {
  write: (message: string) => logger.info(message.trim()),
};

export default logger;
