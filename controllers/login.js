var mainapp = angular.module('mainapp');

mainapp.controller('login', ['$scope','$rootScope','$http','$routeParams','$cookies','LoginService','$location','testfactory','$window',
    function($scope, $rootScope, $http, $routeParams, $cookies, LoginService,$location,testfactory,$window){

    $scope.name = 'LoginController';
    $scope.params = $routeParams;
      

    $scope.login = function () {
        var handleSuccess = function(data, status) {
            dds = data.data.success;
            if (dds){
                setTokenToCookie(dds.token);
                $window.location.href = "/";
            }
        };
        LoginService.login($scope.user.email, $scope.user.pass).then(handleSuccess);
    };


    function setTokenToCookie(token){
        $rootScope.globals = {
            currentUser: {
                username: $scope.user.email,
                authdata: token
            }
        };

        $http.defaults.headers.common['Authorization'] = 'Basic ' + token;

        // store user details in globals cookie that keeps user logged in for 1 week (or until they logout)
        var cookieExp = new Date();
        cookieExp.setDate(cookieExp.getDate() + 7);
        $cookies.putObject('globals', $rootScope.globals, { expires: cookieExp });
        // this is just example of organising cookie
    }

    $scope.user = {
        name: 'Nemanja -> pass : sikimiki',
        email: 'nemanjamil@gmail.com',
        pass: 'sikimiki',
    };

}]);