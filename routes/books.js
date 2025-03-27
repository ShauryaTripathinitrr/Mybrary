const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Book = require('../models/book');
const Author = require('../models/author');

// ✅ Fix: Define Upload Path Properly
Book.coverImageBasePath = 'uploads/bookCovers';
const uploadPath = path.join('public', Book.coverImageBasePath);

const imageMimeTypes = ['image/jpeg', 'image/PNG', 'image/gif', 'image/jpg'];

const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype.toLowerCase())); // ✅ Fix: Check MIME types correctly
    }
});

// ✅ Route 1: Get all books
router.get('/', async (req, res) => {
    let query = Book.find();

    if(req.query.title != null && req.query.title !== ''){
        query = query.regex('title' , new RegExp(req.query.title , 'i'))
    }
    if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
        query = query.lte('publishDate', req.query.publishedBefore)
      }
      if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
        query = query.gte('publishDate', req.query.publishedAfter)
      }
    try{
        const books = await query.exec()
        res.render('books/index' , {
            books: books,
            searchOptions: req.query
        })
    }
    catch{
        res.redirect('/');
    }
});

// ✅ Route 2: Show new book form
router.get('/new', async (req, res) => {
    renderNewPage(res, new Book());
});

// ✅ Route 3: Create new book
router.post('/', upload.single('cover'), async (req, res) => {
    console.log("🔍 Form Data:", req.body);

    const fileName = req.file ? req.file.filename : null;
    const publishDate = new Date(req.body.publishDate);

    if (isNaN(publishDate)) {
        console.error("❌ Invalid Publish Date");
        return renderNewPage(res, new Book(req.body), true);
    }

    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: publishDate,
        pageCount: req.body.pageCount,
        coverImageName: fileName, // ✅ Fix: Ensure filename is stored
        description: req.body.description
    });

    try {
        await book.save();
        console.log("✅ Book saved successfully!");
        res.redirect('/books');
    } catch (err) {
        console.error("❌ Error saving book:", err.message);
        if(book.coverImageName != null){
            removeBookCover(book.coverImageName)
        }
        renderNewPage(res, book, true);
    }
});
function removeBookCover(fileName) {
    fs.unlink(path.join(uploadPath, fileName), err => {
      if (err) console.error(err)
    })
  }
// ✅ Render Function
async function renderNewPage(res, book, hasError = false) {
    try {
        const authors = await Author.find({});
        console.log("✅ Authors fetched:", authors);

        const params = { authors, book };
        if (hasError) params.errorMessage = 'Error Creating Book';

        res.render('books/new', params);
    } catch (err) {
        console.error("❌ Error fetching authors:", err);
        res.redirect('/books');
    }
}

module.exports = router;