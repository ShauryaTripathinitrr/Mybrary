const express = require('express');
const router = express.Router();
const Author = require('../models/author'); // ✅ Ensure correct import

router.get('/', async (req, res) => {
    let searchOptions = {};
    if (req.query.name && req.query.name.trim() !== '') {
        searchOptions.name = req.query.name;
    }

    try {
        const authors = await Author.find({
            name: new RegExp(searchOptions.name, 'i') // Case-insensitive search
        });

        res.render('authors/index', { authors, searchOptions });
    } catch (err) {
        console.error("❌ Error searching authors:", err);
        res.redirect('/');
    }
});


// ✅ Route 2: Show new author form
router.get('/new', (req, res) => {
    res.render('authors/new', { author: new Author() });
});

// ✅ Route 3: Create new author (Fixed save issue)
router.post('/', async (req, res) => {
    const author = new Author({ name: req.body.name });

    try {
        await author.save(); // ✅ No callback, just await
        res.redirect('/authors'); 
    } catch (err) {
        console.error("❌ Error creating author:", err);
        res.render('authors/new', {
            author,
            errorMessage: 'Error Creating Author'
        });
    }
});

module.exports = router;
