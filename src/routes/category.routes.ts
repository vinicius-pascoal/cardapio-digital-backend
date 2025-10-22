import { Router } from 'express';
import { prisma } from '../prisma.js';
import { categoryCreateSchema, categoryUpdateSchema } from '../validators/category.js';

export const router = Router();

router.get('/', async (_req, res) => {
  const data = await prisma.categoria.findMany({ orderBy: { id: 'asc' } });
  res.json(data);
});

router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const cat = await prisma.categoria.findUnique({ where: { id } });
  if (!cat) return res.status(404).json({ error: 'Categoria não encontrada' });
  res.json(cat);
});

router.post('/', async (req, res) => {
  const parsed = categoryCreateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const created = await prisma.categoria.create({ data: parsed.data });
  res.status(201).json(created);
});

router.put('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const parsed = categoryUpdateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  try {
    const updated = await prisma.categoria.update({ where: { id }, data: parsed.data });
    res.json(updated);
  } catch {
    res.status(404).json({ error: 'Categoria não encontrada' });
  }
});

router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);
  try {
    await prisma.categoria.delete({ where: { id } });
    res.status(204).send();
  } catch {
    res.status(404).json({ error: 'Categoria não encontrada' });
  }
});
