import { Router } from 'express';
import { makeContactController } from './factory';

const router = Router();
const controller = makeContactController();

router.post('/contacts', controller.create.bind(controller));
router.get('/contacts', controller.list.bind(controller));
router.get('/contacts/:id', controller.show.bind(controller));
router.put('/contacts/:id', controller.update.bind(controller));

export default router;
