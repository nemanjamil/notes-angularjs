(function (angular) {
    'use strict';

    var mainapp = angular.module('mainapp', ['ngRoute', 'ngCookies', 'ngMaterial', 'ngMessages', 'ngAnimate', 'ngAria']);

    mainapp.run(function ($rootScope) {
        $rootScope.test = new Date();
    });


    mainapp.config(function ($routeProvider, $mdThemingProvider, $locationProvider, $httpProvider) {
        $locationProvider.hashPrefix('');
        //$mdThemingProvider.disableTheming();
        $httpProvider.interceptors.push('authHttpResponseInterceptor');


        $mdThemingProvider.theme('default')
            .primaryPalette('indigo', {
                'default': '400', // by default use shade 400 from the pink palette for primary intentions
                'hue-1': '100', // use shade 100 for the <code>md-hue-1</code> class
                'hue-2': '600', // use shade 600 for the <code>md-hue-2</code> class
                'hue-3': 'A100' // use shade A100 for the <code>md-hue-3</code> class
            })
            .accentPalette('purple', {
                'default': '200'
            });
            //.warnPalette('red')
            //.backgroundPalette('blue-grey');
            //.backgroundPalette('yellow');


        $routeProvider
            .when('/', {
                templateUrl: '../template/main.html',
                controller: 'maincntr',
                titlecontroller: "All Notes",
            })
            .when('/login', {
                templateUrl: '../template/login.html',
                controller: 'login',
                titlecontroller: "Login Page",
            })
            .when('/notes', {
                templateUrl: '../template/notes.html',
                controller: 'notes',
                titlecontroller: "Notes Page",
            })
            .when('/trash', {
                templateUrl: '../template/trash.html',
                controller: 'trash',
                titlecontroller: "Trash Page",
            })
            .when('/images', {
                templateUrl: '../template/images.html',
                controller: 'images',
                titlecontroller: "Images Page",
            })
            .when('/links', {
                templateUrl: '../template/links.html',
                controller: 'links',
                titlecontroller: "Links Page",
            })

            .otherwise({redirectTo: '/'});

        $locationProvider.html5Mode(true);

    });

    mainapp.factory('authHttpResponseInterceptor', ['$q', '$location', function ($q, $location) {
        return {
            response: function (response) {
                if (response.status === 401) {
                    console.log("Response 401");
                }
                return response || $q.when(response);
            },
            responseError: function (rejection) {
                if (rejection.status === 401) {
                    //$location.path('/login').search('returnTo', $location.path());
                    $location.path('/login');
                }
                return $q.reject(rejection);
            }
        }
    }]);

    mainapp.directive('myHeader', function () {
        return {
            templateUrl: '../template/header.html',
            controller: function ($scope) {
            },
            link: function ($scope, element, attrs) {
                $scope.updateCheckbox = function () {
                    $scope.cekiraj = false;
                };
            }
        };
    });


    mainapp.controller('MainController', ['$scope', '$route', '$routeParams', '$location','testfactory','LoginService','$cookies','$window',
        function ($scope, $route, $routeParams, $location,testfactory,LoginService,$cookies,$window) {
            $scope.$route = $route;
            $scope.$location = $location;
            $scope.$routeParams = $routeParams;
            $scope.name = 'MainController';

            $scope.loggeduser = false;

            function userLogIn(){
                var handleSuccess = function(data, status) {
                    var dds = data.data.success;
                    if (dds!==true){
                        $location.path('/login');
                        return;
                    } else {
                        testfactory.loggedyser(dds);
                        $scope.loggeduser = testfactory.loggedyserauth;
                    }
                };
                LoginService.validatelogin().then(handleSuccess);
            }

            var favoriteCookie = $cookies.getObject('globals');
            if (favoriteCookie) {
                userLogIn();
            } else {
                $scope.loggeduser = false;
                $location.path('/login');
                return;
            }

            $scope.logout= function() {
                $cookies.remove("globals");
                $window.location.href = "/";
            }


        }]);


    mainapp.controller('maincntr', ['$scope', 'getData', 'testfactory',
        function ($scope, getData, testfactory) {
            $scope.name = 'maincntr';
            $scope.loading = true;

            GetAllNotes();
            function GetAllNotes() {
                var allNotesVal = getData.getAllNotes();
                allNotesVal.then(function (emp) {
                    if (emp.data.success) {
                        $scope.listnotes = emp.data.data;
                        testfactory.listnotes = $scope.listnotes;
                        $scope.loading = false;
                    } else {
                        console.log("empty");
                    }
                }, function () {

                });
            }

            $scope.toTrash = function ($event, note, index) {
                index = $scope.listnotes.indexOf(note);
                $scope.listnotes.splice(index, 1);

                var getDataDel = getData.removeNote(idjsdel);
                getDataDel.then(function (msg) {
                    console.log("msg : ");
                    console.log(msg.data);
                    if (msg.data.success) {
                        $scope.status = msg.data.error_msg;
                    } else {
                        alert('Node is NOT Trashed');
                    }
                }, function () {
                    alert('Error in Deleting Record');
                });

            };
        }]);


})(window.angular);