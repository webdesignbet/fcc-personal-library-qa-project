/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const expect = chai.expect;

chai.use(chaiHttp);

let testId;

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai
          .request(server)
          .post('/api/books')
          .send({
            title: 'Dotcom Secrets'
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.title, 'Dotcom Secrets');
            assert.equal(res.body.commentcount, 0);
            assert.isArray(res.body.comments);
            testId = res.body._id;
            done();
          });
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai
          .request(server)
          .post('/api/books')
          .send({})
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body, 'missing required field title');
            done();
          });
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai
          .request(server)
          .get('/api/books')
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isArray(res.body, 'response should be an array');
            assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
            assert.property(res.body[0], 'title', 'Books in array should contain title');
            assert.property(res.body[0], '_id', 'Books in array should contain _id');
            done();
          });
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai
          .request(server)
          .get('/api/books/123423')
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body, 'no book exists');
            done();
          });
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai
          .request(server)
          .get(`/api/books/${testId}`)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body._id, testId);
            assert.equal(res.body.title, 'Dotcom Secrets');
            assert.isArray(res.body.comments);
            done();
          });
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai
          .request(server)
          .post(`/api/books/${testId}`)
          .send({ comment: 'The Underground Book' })
          .end((err, res) => {
              assert.equal(res.status, 200);
              assert.equal(res.body.title, 'Dotcom Secrets');
              expect(res.body.comments).deep.to.equal([ 'The Underground Book' ]);
              done();
          });
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        chai
          .request(server)
          .post(`/api/books/${testId}`)
          .send({ })
          .end((err, res) => {
            assert.equal(res.body, 'missing required field comment');
            done();
        });
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        chai
          .request(server)
          .post('/api/books/123456')
          .send({ comment: 'The Underground Book' })
          .end((err, res) => {
            assert.equal(res.body, 'no book exists');
            done();
          });
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai
          .request(server)
          .delete(`/api/books/${testId}`)
          .end((err, res) => {
            assert.equal(res.body, 'delete successful');
            done();
          });
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        chai
          .request(server)
          .delete('/api/books/123456789')
          .end((err, res) => {
            assert.equal(res.body, 'no book exists');
            done();
          });
      });

    });

  });

});
