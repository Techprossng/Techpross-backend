// @ts-check
// entry point of server
const express = require("express");
const cors = require("cors");
const loggingMiddleware = require("./middlewares/logging");
const { Buffer } = require('node:buffer');

const userRouter = require("./routes/User.router");
const subscriberRouter = require("./routes/Subscriber.router");
const contactRouter = require("./routes/Contact.router");
const courseRouter = require("./routes/Course.router");

// initialize express app
const app = express();

// middleware for serializing and validating content-type

// JSON requests
app.use(
    express.json({
        verify: async (req, res, buffer) => {
            let data = '';
            if (Buffer.isBuffer(buffer)) {
                /** @type {string} */
                data = buffer.toString();
            }
            try {
                JSON.parse(data);
            } catch (error) {
                return res.status(400).json({ error: "Not a JSON" });
            }
        },
    })
);

// Use the logging middleware
app.use(loggingMiddleware);

// CORS
const corsOptions = {
    origin: "*", // this will be changed
};
app.use(cors(corsOptions));

// SET ROUTE HANDLERS HERE

// MOUNT ROUTERS
app.use("/api/v1", userRouter);
app.use('/api/v1', subscriberRouter);
app.use("/api/v1", contactRouter);
app.use("/api/v1", courseRouter);

// listening port
const port = 3000;


app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

// export app for tests
module.exports = app;
