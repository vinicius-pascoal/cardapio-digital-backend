import type { Response, Request } from 'express';

// Conjunto de clientes conectados via SSE
const sseClients = new Set<Response>();

// Intervalo de heartbeat (ms)
const HEARTBEAT_INTERVAL = 30_000;

export function setupSSE(_req: Request, res: Response) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  // Ajustar origem conforme necessidade; em produção limite para o domínio do frontend
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Envia headers imediatamente
  // @ts-ignore - alguns ambientes possuem flushHeaders
  if (typeof (res as any).flushHeaders === 'function') (res as any).flushHeaders();

  sseClients.add(res);
  console.log(`[SSE] Cliente conectado. Total: ${sseClients.size}`);

  // Mensagem inicial
  res.write('data: {"type":"connected","message":"SSE connected"}\n\n');

  const heartbeat = setInterval(() => {
    res.write(':heartbeat\n\n');
  }, HEARTBEAT_INTERVAL);

  res.on('close', () => {
    clearInterval(heartbeat);
    sseClients.delete(res);
    console.log(`[SSE] Cliente desconectado. Total: ${sseClients.size}`);
  });
}

export function broadcastSSE(eventName: string, data: any) {
  const payload = `event: ${eventName}\ndata: ${JSON.stringify(data)}\n\n`;
  console.log(`[SSE] Broadcasting '${eventName}' para ${sseClients.size} clientes`);
  for (const client of sseClients) {
    try {
      client.write(payload);
    } catch (err) {
      console.error('[SSE] Erro ao enviar para cliente, removendo.', err);
      sseClients.delete(client);
    }
  }
}

export function getSSEStatus() {
  return { clients: sseClients.size, heartbeatMs: HEARTBEAT_INTERVAL };
}
