import { Router } from 'express';
import { prisma } from '../prisma.js';
import { dishCreateSchema, dishUpdateSchema } from '../validators/dish.js';

export const router = Router();

router.get('/', async (_req, res) => {
  const data = await prisma.prato.findMany({
    include: { categoria: true },
    orderBy: { id: 'asc' }
  });
  res.json(data);
});

router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const dish = await prisma.prato.findUnique({ where: { id }, include: { categoria: true } });
  if (!dish) return res.status(404).json({ error: 'Prato não encontrado' });
  res.json(dish);
});

router.post('/', async (req, res) => {
  const parsed = dishCreateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const created = await prisma.prato.create({ data: parsed.data });
  res.status(201).json(created);
});

router.put('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const parsed = dishUpdateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  try {
    const updated = await prisma.prato.update({ where: { id }, data: parsed.data });
    res.json(updated);
  } catch {
    res.status(404).json({ error: 'Prato não encontrado' });
  }
});

router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);
  try {
    await prisma.prato.delete({ where: { id } });
    res.status(204).send();
  } catch {
    res.status(404).json({ error: 'Prato não encontrado' });
  }
});
