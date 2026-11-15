import { Router } from 'express';
import { contactController } from '../controllers/contactController.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = Router();

router.use(authenticate);
router.get('/', contactController.getContacts);
router.post('/', contactController.addContact);
router.delete('/:id', contactController.deleteContact);
router.post('/notify', contactController.notifyContacts);

export default router;
