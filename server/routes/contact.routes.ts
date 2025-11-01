import { Router } from 'express';
import { sendEmail } from '../controllers/contact.controller.js';

const router = Router();

router.post('/contact', sendEmail);

export default router;
