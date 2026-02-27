const express = require('express');
const path = require('path');
const app = express();
const PORT = 8888;

app.use(express.static(path.join(__dirname, 'public')));

app.use('/profanity-cleaner', express.static(path.join(__dirname, 'node_modules/profanity-cleaner/dist')));

app.listen(PORT, () => {
	console.log('Server is running');
});