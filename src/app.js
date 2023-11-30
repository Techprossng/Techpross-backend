// @ts-check
// entry point of server
const express = require("express");
const cors = require("cors");
const { Buffer } = require('node:buffer');

const userRouter = require("./routes/User.router");
const subscriberRouter = require("./routes/Subscriber.router");
const contactRouter = require("./routes/Contact.router");
const path = require('path');

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

// CORS
const corsOptions = {
    origin: "*", // this will be changed
};
app.use(cors(corsOptions));

// SET ROUTE HANDLERS HERE

// MOUNT ROUTERS
app.use(express.static(path.resolve(__dirname, '../../Techprossng-website/dist')));
app.use("/api/v1", userRouter);
app.use('/api/v1', subscriberRouter);
app.use("/api/v1", contactRouter);

// Catch-all route for React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../Techprossng-website/dist', '../../Techprossng-website/dist/index.html'));
 });

// listening port
const port = 5000;


app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

// export app for tests
module.exports = app;
