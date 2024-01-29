// @ts-check
const { Router } = require('express');

const { validatePayerBody, validatePayerEmail, validatePayerId, validateUpdate
} = require('../middlewares/payments/validatePayer');

// Controllers
const PayerController = require('./Payer.controller');
const RemitaPaymentController = require('./RemitaPayment.controller');
const { validateAuthorization } = require('../middlewares/payments/validatePaymentRequest');


/**
 * ### Payment Router
 */
const router = Router();


/**@description Webhook for remita notification on successful participants payments */
router.post("/payments/notification");

/**@description Endpoint for checking transaction status with RRR */
router.get("/payments/transactions/:RRR", RemitaPaymentController.checkPaymentStatusWithRRR);

/**@description Endpoint for checking transaction status with orderId */
// router.get("/payments/:orderId");

/**@description Endpoint for getting remita secret keys */
router.get("/payments/remita/keys",
    validateAuthorization, RemitaPaymentController.getRemitaSecretKey);

/**@description Add a payer */
router.post("/payers", validatePayerBody, PayerController.addPayer);

/**@description Get payers by page */
router.get("/payers", PayerController.getPayers);

/**@description get payer by id */
router.get("/payers/:id", validatePayerId, PayerController.getPayer);

/**@description get payer by email */
router.get("/payers/emails/:email", validatePayerEmail, PayerController.getPayer);

/**@description Update payer's payment status */
router.put("/payers/:id", validateUpdate, PayerController.updatePayerStatus);

module.exports = router;