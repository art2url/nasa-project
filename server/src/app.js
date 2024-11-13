const path = require('path');
const express = require('express'); // Node.js framework for building web servers and APIs easily.
const cors = require('cors'); // Node.js package for providing a Connect/Express middleware.
const morgan = require('morgan'); // HTTP request logger middleware for node.js

const api = require('./routes/api');

const app = express();

app.use(
    cors({
        origin: 'http://localhost:3000',
    })
);
app.use(morgan('combined'));

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public'))); // used to serve all public files using the path join function

app.use('/v1', api); // added v1 versioning in the router
// app.use('/v2', v2Router); // if needed versioning

// asterisk needs for matching capability after whats follows the /
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

module.exports = app;
