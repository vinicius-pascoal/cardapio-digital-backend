import { z } from 'zod';

export const dishCreateSchema = z.object({
  nome: z.string().min(1),
  descricao: z.string().optional(),
  preco: z.number().positive(),
  categoriaId: z.number().int().positive(),
});

export const dishUpdateSchema = dishCreateSchema.partial().extend({
  nome: z.string().min(1).optional(),
  preco: z.number().positive().optional(),
  categoriaId: z.number().int().positive().optional()
});
