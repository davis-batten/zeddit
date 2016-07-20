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
