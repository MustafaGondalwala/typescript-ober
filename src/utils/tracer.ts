"use strict";
const {
  BasicTracerProvider,
  ConsoleSpanExporter,
  SimpleSpanProcessor,
} = require("@opentelemetry/tracing");
const {
  OTLPTraceExporter,
} = require("@opentelemetry/exporter-trace-otlp-http");
const { Resource } = require("@opentelemetry/resources");
const {
  SemanticResourceAttributes,
} = require("@opentelemetry/semantic-conventions");
const opentelemetry = require("@opentelemetry/sdk-node");
const {
  getNodeAutoInstrumentations,
} = require("@opentelemetry/auto-instrumentations-node");

// Use environment variables for the OTLP endpoint and service name
const OTLP_ENDPOINT =
  process.env.OTEL_EXPORTER_OTLP_ENDPOINT ||
  "http://opentelemetry-collector:4318/v1/traces";
const SERVICE_NAME = process.env.OTEL_SERVICE_NAME || "typescript-express-app";

const traceExporter = new OTLPTraceExporter({
  url: OTLP_ENDPOINT,
});

const provider = new BasicTracerProvider({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: SERVICE_NAME,
  }),
});

// Export spans to OpenTelemetry Collector
provider.addSpanProcessor(new SimpleSpanProcessor(traceExporter));

provider.register();

const sdk = new opentelemetry.NodeSDK({
  traceExporter: traceExporter,
  instrumentations: [getNodeAutoInstrumentations()],
});

export const initializeTelemetry = async () => {
  try {
    await sdk.start();
    console.log("OpenTelemetry initialized successfully");
    console.log(`Telemetry data being sent to ${OTLP_ENDPOINT}`);
  } catch (error) {
    console.error("Failed to initialize OpenTelemetry:", error);
  }
};

process.on("SIGTERM", () => {
  sdk
    .shutdown()
    .then(() => console.log("Tracing terminated"))
    .finally(() => process.exit(0));
});
