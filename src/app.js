// entry point of server
const express = require('express');
const cors = require('cors');

// initialize express app
const app = express();

// middleware for serializing and validating content-type: application/json
app.use(express.json());

// CORS
const corsOptions = {
    origin: "*" // this will be changed
}
app.use(cors(corsOptions));

// listening port
const port = 5000;

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});