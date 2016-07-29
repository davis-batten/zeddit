app.controller('PostsCtrl', ['$scope', '$location', 'posts', 'post', 'auth', function ($scope, $location, posts, post, auth) {

    $scope.post = post;

    $scope.addComment = function () {
        if ($scope.body === '') {
            return;
        }
        posts.addComment(post._id, {
            body: $scope.body,
            author: 'user'
        }).success(function (comment) {
            $scope.post.comments.push(comment);
        });
        $scope.body = '';
    }

    $scope.upvote = function (comment) {
        posts.upvoteComment(post, comment);
    }

    $scope.downvote = function (comment) {
        posts.downvoteComment(post, comment);
    }

    $scope.isLoggedIn = auth.isLoggedIn;

}]);
