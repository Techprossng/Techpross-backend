// entry point of server
const express = require('express');
const cors = require('cors');

// initialize express app
const app = express();

// middleware for serializing and validating content-type
// JSON requests
app.use(express.json({
    verify: async (req, res, buffer, encoding) => {
        try {
            await JSON.parse(buffer);
        } catch (error) {
            return res.status(400).json({ message: 'Not a JSON' });
        }
    }
}));
// query parameters
app.use(express.urlencoded({ extended: false }));

// CORS
const corsOptions = {
    origin: "*" // this will be changed
}
app.use(cors(corsOptions));

// SET ROUTE HANDLERS HERE

// listening port
const port = 5000;

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});