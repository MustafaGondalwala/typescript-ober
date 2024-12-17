import winston from "winston";
import LokiTransport from "winston-loki";

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new LokiTransport({
      host: "http://loki:3100",
      labels: { app: "typescript-express-app" },
      json: true,
      interval: 5,
      timeout: 5000,
    }),
  ],
});