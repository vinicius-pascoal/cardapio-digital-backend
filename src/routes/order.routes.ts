import { Router } from 'express';
import { prisma } from '../prisma.js';
import { orderCreateSchema, orderUpdateSchema } from '../validators/order.js';
import { broadcastSSE } from '../sse.js';

export const router = Router();

router.get('/', async (_req, res) => {
  const data = await prisma.pedido.findMany({
    include: { itens: { include: { prato: true } } },
    orderBy: { id: 'desc' }
  });
  res.json(data);
});

router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const order = await prisma.pedido.findUnique({
    where: { id },
    include: { itens: { include: { prato: true } } }
  });
  if (!order) return res.status(404).json({ error: 'Pedido não encontrado' });
  res.json(order);
});

router.post('/', async (req, res) => {
  const parsed = orderCreateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const created = await prisma.pedido.create({
    data: {
      itens: {
        create: parsed.data.items.map(i => ({
          pratoId: i.pratoId,
          quantidade: i.quantidade ?? 1
        }))
      }
    },
    include: { itens: { include: { prato: { include: { categoria: true } } } } }
  });

  const total = created.itens.reduce((sum, item) => {
    return sum + Number(item.prato.preco) * item.quantidade;
  }, 0);

  const payload = { ...created, total };
  res.status(201).json(payload);
  // Notificar clientes SSE
  broadcastSSE('new-order', payload);
});

router.put('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const parsed = orderUpdateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  try {
    const updated = await prisma.$transaction(async (tx) => {
      await tx.itemPedido.deleteMany({ where: { pedidoId: id } });
      const up = await tx.pedido.update({
        where: { id },
        data: {
          itens: {
            create: parsed.data.items.map(i => ({
              pratoId: i.pratoId,
              quantidade: i.quantidade ?? 1
            }))
          }
        },
        include: { itens: { include: { prato: { include: { categoria: true } } } } }
      });
      return up;
    });

    const total = updated.itens.reduce((sum, item) => sum + Number(item.prato.preco) * item.quantidade, 0);
    const payload = { ...updated, total };
    res.json(payload);
    broadcastSSE('order-update', payload);
  } catch {
    res.status(404).json({ error: 'Pedido não encontrado' });
  }
});

router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);
  try {
    await prisma.pedido.delete({ where: { id } });
    res.status(204).send();
    broadcastSSE('order-delete', { id });
  } catch {
    res.status(404).json({ error: 'Pedido não encontrado' });
  }
});
