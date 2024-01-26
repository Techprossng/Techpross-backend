// @ts-check
const { Router } = require('express');
const { validateAddPayee } = require('../middlewares/payments/validateAddPayee');

const router = Router();


/**@description Webhook for remita notification on successful participants payments */
router.post("/training/payments/notification");

/**@description Endpoint for checking transaction status with RRR */
router.get("/training/payments/:RRR")

/**@description Endpoint for checking transaction status with orderId */
router.get("/training/payments/:orderId");

/**@description Endpoint for getting remita secret key */
router.get("/training/payments/remita/secretKey");

/**@description Add a payer */
router.post("/training/payers", validateAddPayee);

router.get("/training/payers");

router.get("/training/payers/:id");

router.get("/training/payers/:email");