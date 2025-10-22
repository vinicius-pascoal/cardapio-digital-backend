import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { router as categoryRouter } from './routes/category.routes.js';
import { router as dishRouter } from './routes/dish.routes.js';
import { router as orderRouter } from './routes/order.routes.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api/categories', categoryRouter);
app.use('/api/dishes', dishRouter);
app.use('/api/orders', orderRouter);

export default app;
