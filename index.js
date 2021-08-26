const express = require('express');
const connectDB = require('./config/db');
const path = require('path');

const app = express();

// Connect to database
connectDB();

app.use(express.json());
app.use("/public", express.static(path.join(__dirname, "static")));
app.use(bodyParser.urlencoded({ extended: true }));

// Define Routes
app.use('/', require('./routes/index'));
app.use('/api/url', require('./routes/url'));

const PORT = 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

//git push -u origin main