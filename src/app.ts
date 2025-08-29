import express from 'express';
import cors from 'cors';
import contactsRoutes from './routes/contacts.routes';
import { errorHandler } from './controllers/middlewares';

const app = express();
app.use(cors());
app.use(express.json());
app.use(contactsRoutes);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use(errorHandler);

export default app;
