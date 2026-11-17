import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { LoggerProvider, SimpleLogRecordProcessor } from '@opentelemetry/sdk-logs';
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';



// Ativa logs internos de diagnóstico para sabermos se o SDK está funcionando
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

// Configura o exportador de Traces para o Coletor OpenTelemetry (porta 4318 HTTP padrão)
const traceExporter = new OTLPTraceExporter({
  url: 'http://localhost:4318/v1/traces', // Ajuste para o IP/porta do coletor se necessário
});

// Configura o exportador de Logs
const logExporter = new OTLPLogExporter({
  url: 'http://localhost:4318/v1/logs',
});

const loggerProvider = new LoggerProvider({
  processors: [new SimpleLogRecordProcessor({ exporter: logExporter })],
});

// Inicializa o SDK com instrumentações automáticas (HTTP, Express, etc.)
const sdk = new NodeSDK({
  resource: resourceFromAttributes({
    [ATTR_SERVICE_NAME]: 'apv1',
  }),
  traceExporter,
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();
console.log('🚀 OpenTelemetry SDK inicializado com sucesso.');

// Encerra o SDK graciosamente ao fechar a aplicação
process.on('SIGTERM', () => {
  sdk.shutdown()
    .then(() => console.log('OpenTelemetry SDK encerrado.'))
    .catch((error) => console.log('Erro ao encerrar SDK', error))
    .finally(() => process.exit(0));
});