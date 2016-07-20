var app = angular.module('zeddit', ['ui.router']);

app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('home', {
        url: '/home',
        templateUrl: '/home.html',
        controller: 'MainCtrl',
        resolve: {
            postPromise: ['posts', function (posts) {
                return posts.getAll();
            }]
        }
    });
    $stateProvider.state('posts', {
        url: '/posts/{id}',
        templateUrl: '/posts.html',
        controller: 'PostsCtrl',
        resolve: {
            post: ['$stateParams', 'posts', function ($stateParams, posts) {
                return posts.get($stateParams.id);
            }]
        }
    });
    $stateProvider.state('login', {
        url: '/login',
        templateUrl: '/login.html',
        controller: 'AuthCtrl',
        onEnter: ['$state', 'auth', function ($state, auth) {
            if (auth.isLoggedIn()) {
                $state.go('home');
            }
        }]
    });

    $stateProvider.state('register', {
        url: '/register',
        templateUrl: '/register.html',
        controller: 'AuthCtrl',
        onEnter: ['$state', 'auth', function ($state, auth) {
            if (auth.isLoggedIn()) {
                $state.go('home');
            }
        }]
    })

    $urlRouterProvider.otherwise('home');
}])

app.factory('posts', ['$http', function ($http) {
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
        return $http.post('/posts', post)
            .success(function (data) {
                o.posts.push(data);
            });
    };

    //upvote a post
    o.upvote = function (post) {
        return $http.put('/posts/' + post._id + '/upvote')
            .success(function (data) {
                post.upvotes += 1;
            });
    };

    //add a new comment to a post
    o.addComment = function (id, comment) {
        return $http.post('/posts/' + id + '/comments', comment);
    };

    //upvote a comment
    o.upvoteComment = function (post, comment) {
        return $http.put('/posts/' + post._id + '/comments/' + comment._id + '/upvote')
            .success(function (data) {
                comment.upvotes += 1;
            });
    };

    return o;
}])

app.factory('auth', ['$http', '$window', function ($http, $window) {
    var auth = {};

    //save JWT to local storage
    auth.saveToken = function (token) {
        $window.localStorage['zeddit-token'] = token;
    };

    //fetch JWT from local storage
    auth.getToken = function () {
        return $window.localStorage['zeddit-token'];
    };

    //check if user is logged in by checking for a unexpired JWT
    auth.isLoggedIn = function () {
        var token = auth.getToken();

        if (token) {
            var payload = JSON.parse($window.atob(token.split('.')[1]));
            return payload.exp > Date.now() / 1000;
        } else {
            return false;
        }
    };

    //get username of a user if they are logged in
    auth.currentUser = function () {
        if (auth.isLoggedIn()) {
            var token = auth.getToken();
            var payload = JSON.parse($window.atob(token.split('.')[1]));

            return payload.username;
        }
    };

    //register and login as new user
    auth.register = function (user) {
        return $http.post('/register', user)
            .success(function (data) {
                auth.saveToken(data.token);
            });
    };

    //login in as user
    auth.login = function (user) {
        return $http.post('/login', user)
            .success(function (data) {
                auth.saveToken(data.token);
            });
    };

    //logout the user
    auth.logout = function () {
        $window.localStorage.removeItem('zeddit-token');
    };

    return auth;
}])


app.controller('MainCtrl', ['$scope', 'posts', function ($scope, posts) {
    $scope.test = 'Hello World!'

    $scope.posts = posts.posts;

    $scope.addPost = function () {
        if (!$scope.title || $scope.title === '') {
            return;
        }
        posts.create({
            title: $scope.title,
            link: $scope.link
        });
        $scope.title = '';
        $scope.link = '';
    };

    $scope.incrementUpvotes = function (post) {
        posts.upvote(post);
    }

}]);


app.controller('PostsCtrl', ['$scope', '$location', 'posts', 'post', '$log', function ($scope, $location, posts, post, $log) {

    $log.debug(post);

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

    $scope.incrementUpvotes = function (comment) {
        posts.upvoteComment(post, comment);
    }

}]);

app.controller('AuthCtrl', ['$scope', '$state', 'auth', function ($scope, $state, auth) {

    $scope.user = {};

    $scope.register = function () {
        auth.register($scope.user).error(function (error) {
            $scope.error = error;
        }).then(function () {
            $state.go('home');
        });
    };

    $scope.login = function () {
        auth.login($scope.user).error(function (error) {
            $scope.error = error;
        }).then(function () {
            $state.go('home');
        });
    };
}]);

app.controller('NavCtrl', ['$scope', 'auth', function ($scope, auth) {
    $scope.isLoggedIn = auth.isLoggedIn;
    $scope.currentUser = auth.currentUser;
    $scope.logout = auth.logout();
}]);
