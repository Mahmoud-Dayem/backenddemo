require('dotenv').config()
const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Hello World!fds');
});

const PORT = process.env.PORT
console.log(PORT);

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});


module.exports = app;
