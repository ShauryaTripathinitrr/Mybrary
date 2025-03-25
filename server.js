if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config(); // Load .env variables
}

const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');

const indexRouter = require('./routes/index');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(express.static('public'));

// ✅ Ensure DATABASE_URL is loaded from .env
const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
    console.error("❌ DATABASE_URL is missing in .env");
    process.exit(1);
}

// ✅ Fix: Remove deprecated options
mongoose.connect(dbUrl)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

app.use('/', indexRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
