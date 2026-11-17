import './tracing'; // Deve ser importado antes de qualquer outra biblioteca
import * as http from 'http';
import { trace } from '@opentelemetry/api';

const tracer = trace.getTracer('meu-servico-typescript');

const server = http.createServer((req, res) => {
  // Criando um Span manual para uma rota específica
  tracer.startActiveSpan('processar-requisicao', (span) => {
    span.setAttribute('http.method', req.method || 'GET');
    span.setAttribute('http.url', req.url || '/');

    console.log(`📥 Requisição recebida em: ${req.url}`);

    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Olá do app instrumentado com OpenTelemetry e TypeScript!\n');

    span.end(); // Finaliza o span manual
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`🌐 Servidor rodando na porta ${PORT}`);
});