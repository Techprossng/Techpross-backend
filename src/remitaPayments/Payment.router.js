// @ts-check
const { Router } = require('express');

const { validatePayerBody, validatePayerEmail, validatePayerId, validateUpdate
} = require('../middlewares/payments/validatePayer');

const PayerController = require('./Payer.controller');


/**
 * ### Payment Router
 */
const router = Router();


/**@description Webhook for remita notification on successful participants payments */
router.post("/payments/notification");

/**@description Endpoint for checking transaction status with RRR */
router.get("/payments/:RRR")

/**@description Endpoint for checking transaction status with orderId */
router.get("/payments/:orderId");

/**@description Endpoint for getting remita secret key */
router.get("/payments/remita/secretKey");

/**@description Add a payer */
router.post("/payers", validatePayerBody, PayerController.addPayer);

/**@description Get payers by page */
router.get("/payers");

router.get("/payers/:id", validatePayerId, PayerController.getPayer);

router.get("/payers/:email", validatePayerEmail, PayerController.getPayer);

/**@description Update payer's payment status */
router.put("/payers/:id", validateUpdate, PayerController.updatePayerStatus);

module.exports = router;