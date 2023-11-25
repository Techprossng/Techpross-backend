const morgan = require('morgan');
const fs = require('fs');
const path = require('path');


// Create the logs directory and files if they don't exist
const logsDirectory = path.join(__dirname, '../../logs');
const logFiles = ['info.log', 'success.log', 'redirect.log', 'error.log', 'server-error.log'];


if (!fs.existsSync(logsDirectory)) {
    fs.mkdirSync(logsDirectory);
}

logFiles.forEach(logFile => {
    const filePath = path.join(logsDirectory, logFile);
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, ''); // Create an empty file
    }
});

// Create writable streams for log files
const infoLogStream = fs.createWriteStream(path.join(logsDirectory, 'info.log'), { flags: 'a' });
const successLogStream = fs.createWriteStream(path.join(logsDirectory, 'success.log'), { flags: 'a' });
const redirectLogStream = fs.createWriteStream(path.join(logsDirectory, 'redirect.log'), { flags: 'a' });
const errorLogStream = fs.createWriteStream(path.join(logsDirectory, 'error.log'), { flags: 'a' });
const serverErrorLogStream = fs.createWriteStream(path.join(logsDirectory, 'server-error.log'), { flags: 'a' });

// Creating a Custom Morgan Token
morgan.token('type', function (req, res) {
    return req.headers['content-type']
})

// Function to determine the log type based on the status code
function getStatusLogType(statusCode) {
    if (statusCode >= 100 && statusCode < 200) {
        return 'info';
    } else if (statusCode >= 200 && statusCode < 300) {
        return 'success';
    } else if (statusCode >= 300 && statusCode < 400) {
        return 'redirect';
    } else if (statusCode >= 400 && statusCode < 500) {
        return 'error';
    } else if (statusCode >= 500) {
        return 'server-error';
    } else {
        return 'info'; // Default for other cases
    }
}

// Middleware for logging requests
function loggingMiddleware(req, res, next) {
    // Use the 'status' token to determine the log type
    const logType = getStatusLogType(res.statusCode);

    // Use the appropriate stream based on the log type
    switch (logType) {
        case 'info':
            morgan(`INFO: :method :url :status :res[content-length] :response-time ms :date[web] :type`, { stream: infoLogStream })(req, res, next);
            break;
        case 'success':
            morgan(`SUCCESS: :method :url :status :res[content-length] :response-time ms :date[web] :type`, { stream: successLogStream })(req, res, next);
            break;
        case 'redirect':
            morgan(`REDIRECT: :method :url :status :res[content-length] :response-time ms :date[web] :type`, { stream: redirectLogStream })(req, res, next);
            break;
        case 'error':
            morgan(`ERROR: :method :url :status :res[content-length] :response-time ms :date[web] :type`, { stream: errorLogStream })(req, res, next);
            break;
        case 'server-error':
            morgan(`SERVER ERROR: :method :url :status :res[content-length] :response-time ms :date[web] :type`, { stream: serverErrorLogStream })(req, res, next);
            break;
        default:
            // Use a default stream or handle other cases as needed
            morgan(`INFO: :method :url :status :res[content-length] :response-time ms :date[web] :type`, { stream: infoLogStream })(req, res, next);
    }
};


module.exports = loggingMiddleware;