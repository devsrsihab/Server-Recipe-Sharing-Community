import express from 'express';
import { PaymentControllers } from './payment.controller';
const router = express.Router();

// make a get route of root
router.post('/', PaymentControllers.sendPaymentInfoToUtils);

// Create Facilitie (POST)
router.post('/confirmation', PaymentControllers.showSuccessPage);

export const PaymentRoute = router;
