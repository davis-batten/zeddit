var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {
        title: 'Express'
    });
});

module.exports = router;


var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');

// -----------Params-------------

//:post param
router.param('post', function (req, res, next, id) {
    var query = Post.findById(id);

    query.exec(function (err, post) {
        if (err) {
            return next(err);
        }
        if (!post) {
            return next(new Error('Post could not be found.'));
        }

        req.post = post;
        return next();
    });
});

//:comment param
router.param('comment', function (req, res, next, id) {
    var query = Comment.findById(id);

    query.exec(function (err, comment) {
        if (err) {
            return next(err);
        }
        if (!comment) {
            return next(new Error('Comment could not be found.'))
        }
        req.comment = comment;
        return next();
    });
});

// -------------Routes--------------

//GET /posts - return list of posts and associated metadata
router.get('/posts', function (req, res, next) {
    Post.find(function (err, posts) {
        if (err) {
            return next(err);
        }
        res.json(posts);
    });
});

//POST /posts - create a new post
router.post('/posts', function (req, res, next) {
    var post = new Post(req.body);

    post.save(function (err, post) {
        if (err) {
            return next(err);
        }
        res.json(post);
    });
});

//GET /posts/:post - return a single post
router.get('/posts/:post', function (req, res, next) {
    req.post.populate('comments', function (err, post) {
        if (err) {
            return next(err);
        }
        res.json(req.post);
    });

});

//PUT /posts/:post/upvote - upvote a post
router.put('/posts/:post/upvote', function (req, res, next) {
    req.post.upvote(function (err, post) {
        if (err) {
            return next(err);
        }
        res.json(post);
    });
});

//POST /posts/:post/comments - post a new comment to a post
router.post('/posts/:post/comments', function (req, res, next) {
    var comment = new Comment(req.body);
    comment.post = req.post;

    comment.save(function (err, comment) {
        if (err) {
            return next(err);
        }
        req.post.comments.push(comment);
        req.post.save(function (err, post) {
            if (err) {
                return next(err);
            }
            res.json(comment);
        });
    });
});

//PUT /posts/:post/comments/:comment/upvote - upvote a comment
router.put('/posts/:post/comment/:comment/upvote', function (req, res, next) {
    req.comment.upvote(function (err, comment) {
        if (err) {
            return next(err);
        }
        res.json(comment);
    });
});
