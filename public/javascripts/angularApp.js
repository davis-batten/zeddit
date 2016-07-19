var app = angular.module('zeddit', ['ui.router']);

app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('home', {
        url: '/home',
        templateUrl: '/home.html',
        controller: 'MainCtrl'
    });
    $stateProvider.state('posts', {
        url: '/posts/{id}',
        templateUrl: '/posts.html',
        controller: 'PostsCtrl'
    });
    $urlRouterProvider.otherwise('home');
}])

app.factory('posts', [function () {
    var o = {
        posts: []
    };
    return o;
}])


app.controller('MainCtrl', ['$scope', 'posts', function ($scope, posts) {
    $scope.test = 'Hello World!'

    $scope.posts = posts.posts;

    $scope.addPost = function () {
        if (!$scope.title || $scope.title === '') {
            return;
        }
        $scope.posts.push({
            title: $scope.title,
            link: $scope.link,
            upvotes: 1,
            comments: [
                {
                    author: 'Joe',
                    body: 'Cool post!',
                    upvotes: 3
                },
                {
                    author: 'Bob',
                    body: 'Great idea but everything is wrong!',
                    upvotes: 1
                }
            ]
        });
        $scope.title = '';
        $scope.link = '';
    };

    $scope.incrementUpvotes = function (post) {
        post.upvotes += 1;
    }

}]);


app.controller('PostsCtrl', ['$scope', '$stateParams', '$location', 'posts', function ($scope, $stateParams, $location, posts) {

    $scope.post = posts.posts[$stateParams.id];

    $scope.addComment = function () {
        if ($scope.body === '') {
            return;
        }
        $scope.post.comments.push({
            body: $scope.body,
            author: 'user',
            upvotes: 1
        });
        $scope.body = '';
    }

}])
