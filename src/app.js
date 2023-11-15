// entry point of server
const express = require("express");
const cors = require("cors");
const subscriberRouter = require('./routes/Subscriber.routes');

// initialize express app
const app = express();

// middleware for serializing and validating content-type

// JSON requests
app.use(
    express.json({
        verify: async (req, res, buffer, encoding) => {
            try {
                await JSON.parse(buffer);
            } catch (error) {
                return res.status(400).json({ message: "Not a JSON" });
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
const userRouter = require("./routes/User.router");

// MOUNT ROUTERS
app.use("/api/v1", userRouter);
app.use('/api/v1', subscriberRouter);

// listening port
const port = 3000;


app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
