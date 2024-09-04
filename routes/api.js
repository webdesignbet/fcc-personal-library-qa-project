/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

let ObjectId = require('mongodb').ObjectId;
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

mongoose.connect(process.env.DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

module.exports = function (app) {

  const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    commentcount: Number,
    comments: [String]
  });
  let Book = mongoose.model('Book', bookSchema);

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      let allBooks = [];
      Book.find({}, (err, data) => {
        if (err) {
          console.log('error in get .find()');
          return err;
        } else {
          data.forEach(book => {
            allBooks.push({
              _id: book._id,
              title: book.title,
              commentcount: book.commentcount
            });
          });
          return res.json(allBooks);
        }
      });
    })
    
    .post(function (req, res){
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      console.log(title);
      if (!title) {
        res.json('missing required field title');
        console.log('No title');
        return;
      }

      const newBook = new Book({
        title: title,
        commentcount: 0,
        comments: []
      });

      newBook.save((err, data) => {
        if (err) {
          console.log('error');
          return res.json('new book could not save into database');
        } else if (!err && data) {
          console.log('new book has been added to database');
          return res.json(data);
        } else {
          console.log('no error and new book has not been added');
          return;
        }
      });
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      Book.deleteMany({}, (err, response) => {
        if (err) {
          return res.json('error deleting all books');
        } else if (!err && response) {
          console.log('complete delete successful');
          return res.json('complete delete successful');
        } else {
          console.log('no error and did not delete all books');
          return;
        }
      });
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      Book.findById(bookid, (err, book) => {
        if (!err && book) {
          console.log('book found');
          res.json({
            _id: book._id,
            title: book.title,
            comments: book.comments
          });
        } else {
          console.log('Error no book found');
          res.json('no book exists');
        }
      });
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      if (!comment) {
        console.log('no comment');
        return res.json('missing required field comment');
      }

      Book.findByIdAndUpdate(bookid, {
        $push: { comments: comment },
        $inc: { commentcount: 1 }
      },
      { new: true }, 
      (err, update) => {
        if (!err && update) {
          console.log('successfully updated');
          return res.json({
            _id: update._id,
            title: update.title,
            comments: update.comments
          });
        } else if (!update) {
          return res.json('no book exists');
        }
      });
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      Book.findByIdAndRemove(bookid, (err, removed) => {
        if (!err && removed) {
          console.log('one book removed');
          return res.json('delete successful');
        } else {
          console.log('error in removal of one book');
          return res.json('no book exists');
        }
      });
    });
  
};
