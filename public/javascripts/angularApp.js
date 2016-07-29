app = angular.module('zeddit', ['ui.router']);

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

app.controller('MainCtrl', ['$scope', '$window', 'posts', 'auth', function ($scope, $window, posts, auth) {
    $scope.test = 'Hello World!'

    $scope.posts = posts.posts;

    $scope.addPost = function () {
        if (!$scope.title || $scope.title === '') {
            return;
        }
        posts.create({
            title: $scope.title,
            link: $scope.link,
            text: $scope.text
        });
        $scope.title = '';
        $scope.link = '';
        $scope.text = '';
    };

    $scope.upvote = function (post) {
        posts.upvote(post);
    }

    $scope.downvote = function (post) {
        posts.downvote(post);
    }

    $scope.isLoggedIn = auth.isLoggedIn;

    $scope.open = function (post) {
        $window.location.href = "#/posts/" + post._id;
    }

    $scope.reload = function () {
        $window.location.reload();
    }

}]);

app.controller('NavCtrl', ['$scope', 'auth', function ($scope, auth) {
    $scope.isLoggedIn = auth.isLoggedIn;
    $scope.currentUser = auth.currentUser;
    $scope.logout = auth.logout;
}]);
