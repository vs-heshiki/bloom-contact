import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import * as path from 'path';
import * as fs from 'fs';
import contactsRoutes from './main/routes/contacts.routes';
import { errorHandler } from './main/controllers/middlewares';

const app = express();
app.use(cors());
app.use(express.json());
app.use(contactsRoutes);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use(errorHandler);

const swaggerPath = path.join(__dirname, './swagger.json');
const swaggerDoc = JSON.parse(fs.readFileSync(swaggerPath, 'utf-8'));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

export default app;
