const mongoose = require('mongoose');
const coverImageBasePath = 'uploads/bookCovers'
const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {  // ✅ Fixed spelling mistake
        type: String
    },
    publishDate: {
        type: Date,
        required: true
    },
    pageCount: {
        type: Number,
        required: true 
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    coverImageName: {
        type: String,
        required: false
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Author'
    }
});
bookSchema.virtual('coverImagePath').get(function() {
    if (this.coverImageName != null) {
      return path.join('/', coverImageBasePath, this.coverImageName)
    }
  })
bookSchema.statics.coverImageBasePath = 'uploads/bookCovers';

module.exports = mongoose.model('Book', bookSchema); 
module.exports.coverImageBasePath = coverImageBasePath;
