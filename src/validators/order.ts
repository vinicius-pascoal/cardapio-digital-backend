import { z } from 'zod';

export const orderItemSchema = z.object({
  pratoId: z.number().int().positive(),
  quantidade: z.number().int().positive().default(1)
});

export const orderCreateSchema = z.object({
  items: z.array(orderItemSchema).min(1)
});

export const orderUpdateSchema = orderCreateSchema;
