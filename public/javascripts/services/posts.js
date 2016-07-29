app.factory('posts', ['$http', 'auth', function ($http, auth) {
    var o = {
        posts: []
    };

    //fetch a single post by id
    o.get = function (id) {
        return $http.get('/posts/' + id)
            .then(function (res) {
                return res.data;
            });
    };

    //get all posts
    o.getAll = function () {
        return $http.get('/posts')
            .success(function (data) {
                angular.copy(data, o.posts);
            });
    };

    //create a new post
    o.create = function (post) {
        return $http.post('/posts', post, {
                headers: {
                    Authorization: 'Bearer ' + auth.getToken()
                }
            })
            .success(function (data) {
                o.posts.push(data);
            });
    };

    //upvote a post
    o.upvote = function (post) {
        return $http.put('/posts/' + post._id + '/upvote', null, {
                headers: {
                    Authorization: 'Bearer ' + auth.getToken()
                }
            })
            .success(function (data) {
                post.upvotes += 1;
            });
    };

    //downvote a post
    o.downvote = function (post) {
        return $http.put('/posts/' + post._id + '/downvote', null, {
                headers: {
                    Authorization: 'Bearer ' + auth.getToken()
                }
            })
            .success(function (data) {
                post.upvotes -= 1;
            });
    };

    //add a new comment to a post
    o.addComment = function (id, comment) {
        return $http.post('/posts/' + id + '/comments', comment, {
            headers: {
                Authorization: 'Bearer ' + auth.getToken()
            }
        });
    };

    //upvote a comment
    o.upvoteComment = function (post, comment) {
        return $http.put('/posts/' + post._id + '/comments/' + comment._id + '/upvote', null, {
                headers: {
                    Authorization: 'Bearer ' + auth.getToken()
                }
            })
            .success(function (data) {
                comment.upvotes += 1;
            });
    };

    //downvote a comment
    o.downvoteComment = function (post, comment) {
        return $http.put('/posts/' + post._id + '/comments/' + comment._id + '/downvote', null, {
                headers: {
                    Authorization: 'Bearer ' + auth.getToken()
                }
            })
            .success(function (data) {
                comment.upvotes -= 1;
            });
    };

    return o;
}])
