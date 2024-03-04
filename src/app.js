// @ts-check
const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const loggingMiddleware = require("./middlewares/logging");
const { Buffer } = require("node:buffer");

const userRouter = require("./routes/User.router");
const subscriberRouter = require("./routes/Subscriber.router");
const contactRouter = require("./routes/Contact.router");
const courseRouter = require("./routes/Course.router");
const instructorRouter = require("./routes/Instructor.router");
const paymentRouter = require("./remitaPayments/Payment.router");
const path = require('path');

const BrokerService = require("./services/brokerService");

// session object
const SessionAuth = require('./session');


// initialize express app
const app = express();

// middleware for serializing and validating content-type

// JSON requests
app.use(
  express.json({
    verify: async (req, res, buffer) => {
      let data = "";
      if (Buffer.isBuffer(buffer)) {
        /** @type {string} */
        data = buffer.toString();
      }
      try {
        JSON.parse(data);
      } catch (error) {
        // @ts-ignore
        return res.status(400).json({ error: "Not a JSON" });
      }
    },
  })
);

// Use cookie
app.use(cookieParser());

// Use the logging middleware
app.use(loggingMiddleware);

// use session object
const sessionObj = SessionAuth.getSessionInstance();
app.use(sessionObj);

// CORS
const corsOptions = {
  origin: "*", // this will be changed
};
app.use(cors(corsOptions));

// SET ROUTE HANDLERS HERE

// MOUNT ROUTERS
app.use("/api/v1", userRouter);
app.use("/api/v1", subscriberRouter);
app.use("/api/v1", contactRouter);
app.use("/api/v1", courseRouter);
app.use("/api/v1", instructorRouter);
app.use("/api/v1", paymentRouter);
app.use(express.static(path.join(__dirname, '../../Techprossng-website/dist')));

// Catch-all route for React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../Techprossng-website/dist', '../../Techprossng-website/dist/index.html'));
});


// listening port
const port = 3000;

app.listen(port, async () => {
  // start rabbitmq email worker
  // ![NOTE] Broker service not supported on server
  await BrokerService.startEmailWorker();
  console.log(`Server is listening on port ${port}`);
});

// export app for tests
module.exports = app;
