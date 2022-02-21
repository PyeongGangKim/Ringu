var express = require('express');
var router = express.Router();

router.get('/login/', function(req, res, next) {
    res.render('testcase/login');
});

router.get('/signup/', function(req, res, next) {
    res.render('testcase/signup');
});
router.get('/book_register/', function(req, res, next){
    res.render('testcase/book_register');
});
router.get('/book_info/', function(req, res, next){
    res.render('testcase/book_info');
});
router.get('/favorite_author/', function(req, res, next){
    res.render('testcase/favorite_author');
});
router.get('/favorite_book/', function(req, res, next){
    res.render('testcase/favorite_book');
});
router.get('/purchase/', function(req, res, next){
    res.render('testcase/purchase');
});
router.get('/category/', function(req, res, next){
    res.render('testcase/category');
});
router.get('/upload/', function(req, res, next){
    res.render('testcase/upload');
});
router.get('/pay/', function(req, res, next){
    res.render('testcase/pay');
})
module.exports = router;
