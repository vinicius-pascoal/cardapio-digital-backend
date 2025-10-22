import { z } from 'zod';

export const categoryCreateSchema = z.object({
  nome: z.string().min(1)
});

export const categoryUpdateSchema = z.object({
  nome: z.string().min(1)
});
