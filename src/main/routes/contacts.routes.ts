import { Router } from 'express';
import { makeContactController } from './factory';

const router = Router();
const controller = makeContactController();

router.post('/contacts', controller.create.bind(controller));
router.get('/contacts', controller.list.bind(controller));

export default router;
