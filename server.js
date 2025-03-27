const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config(); // ✅ Load environment variables

// ✅ Import Routes
const indexRouter = require('./routes/index');
const authorRouter = require('./routes/authors');
const bookRouter = require('./routes/books'); // ✅ Ensure this is correctly imported

// ✅ Middleware
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.locals.basedir = __dirname + '/views';

app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }));
app.set('views', __dirname + '/views');
app.locals.basedir = __dirname + '/views';  // Add this
// ✅ Connect to MongoDB
const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
    console.error("❌ DATABASE_URL is missing in .env");
    process.exit(1);
}

mongoose.connect(dbUrl)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

app.use(express.urlencoded({ extended: true }));

// ✅ Use Routes
app.use('/', indexRouter);
app.use('/authors', authorRouter);
app.use('/books', bookRouter); // ✅ Ensure books route is being used


// ✅ Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
