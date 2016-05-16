var express = require('express');
var router = express.Router();

/*
 * ============================================================
 *					Databse Model
 * ============================================================
 */


var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/blog');
var PostSchema = new mongoose.Schema({
  title : String,
  body : String,
  updated_at : { type : Date, default: Date.now }
});
var Post = mongoose.model('Post', PostSchema);

/*
 * ============================================================
 *					Routing
 * ============================================================
 */

/* GET posts listing. */
router.get('/', function(req, res, next) {
	Post.find(function(err, doc) {
		if( err )
			res.send('err = ' + err);
		res.render('posts/index', { posts: doc });
	});
});

router.post('/', function(req, res, next) {
	var post = new Post({ "title" : req.body.title , "body" : req.body.body });
	post.save(function(err) {
		if( err )
			return err;
		Post.find(function(err, doc) {
			if( err )
				res.send('err = ' + err);
			res.redirect('/posts');
		});
	})
})

router.get('/add', function(req, res, next) {
	Post.find(function(err, doc) {
		if( err )
			res.send('err = ' + err);
		res.render('posts/add');
	});
});


router.get('/edit/:id', function(req, res, next) {

	Post.findById(req.params.id, function(err, doc) {
		if( err )
			res.send('err = ' + err);
		res.render('posts/edit', { post : doc});
	});
});

router.post('/update/:id', function(req, res, next) {

	Post.findOneAndUpdate(
		{'_id' : req.params.id},
		{ title : req.body.title , body : req.body.body },
	 	function(err, doc) {
			if( err )
				return res.send(err)
		res.redirect('/posts');
	})
})

router.get('/delete/:id', function(req, res, next) {
	Post.findOneAndRemove({'_id' : req.params.id}, function (err,offer){
    	res.redirect('/posts');
    });
});



// var post = new Post({ title : 'this is post 2', body : 'this is content 2'});
// post.save(function(err) {
//   console.log(err);
// });




module.exports = router;
