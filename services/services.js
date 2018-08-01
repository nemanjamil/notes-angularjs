var mainapp = angular.module('mainapp');
mainapp.constant("website", "http://godaddyserver/api/1.0/");

mainapp.factory('testfactory', function () {

    var testObj = {};

    testObj.one = function (item) {
        this.ime = item;
    };

    testObj.listnotes = function (listnotes) {
        this.listnotes = listnotes;
    };

    testObj.loggedyser = function (logged) {
        this.loggedyserauth = logged;
    };

    testObj.pushNotes = function (newNote) {
        //this.listnotes.push(newNote);
        this.listnotes.splice(0, 0, newNote);
    };

    return testObj;
});


mainapp.directive('headerAdd', ['testfactory', '$mdDialog', 'getData',
    function (testfactory, $mdDialog, getData) {
        return {
            templateUrl: '../template/headeradd.html',
            controller: function ($scope) {

                $scope.allTrash = function () {
                    if (confirm("Are you sure?")) {
                        arrayRemove = [];
                        data = testfactory.listnotes;
                        for (let i = 0; i < data.length; i++) {
                            if (data[i].active == 0) {
                                arrayRemove.push(i);

                                $index = data.indexOf(data[i]);
                                data.splice($index, 1);

                               /* getDataDel = getData.fullRemoveFromNotesService(data[i]);
                                getDataDel.then(function (msg) {
                                    if (msg.data.success) {
                                        $index = $scope.listnotes.indexOf(note);
                                        $scope.listnotes.splice($index, 1);
                                    } else {
                                        alert('Node is NOT DELETED');
                                    }
                                }, function () {
                                    alert('Error in Deleting Record');
                                });*/


                            }
                        }
                    }
                };
            },
            link: function ($scope, $element, $attrs) {

                $scope.status = '  ';
                $scope.customFullscreen = false;
                $scope.showAdvanced = function (ev) {
                    $mdDialog.show({
                        controller: DialogController,
                        templateUrl: 'template/dialog.html?t=' + Math.random(),
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        clickOutsideToClose: true,
                        fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.

                    })
                        .then(function (answer) {
                            if (answer == 0) {
                                $scope.status = "You say no to edit :) "
                            } else {

                                var getDataAdd = getData.addNote(answer);
                                getDataAdd.then(function (msg) {
                                    if (msg.data.success) {
                                        testfactory.pushNotes(msg.data.data);
                                    } else {
                                        alert(msg.data.message);
                                    }
                                }, function () {
                                    alert('Error in Update');
                                });

                            }

                        }, function () {
                            $scope.status = 'You cancelled the dialog.';
                        });
                };

                function DialogController($scope, $mdDialog) {

                    var vm = this;

                    $scope.showHideTest = true;
                    $scope.dialog = {
                        first: "Title",
                        second: "Text Note"
                    };

                    $scope.changeType = function (val) {
                        getSelect(val);
                    };

                    function getSelect(val){
                        if (val == 1) {
                            $scope.showHideTest = true;
                            $scope.dialog.first = "Title";
                            $scope.dialog.second = "Text Note"
                        } else if (val == 2) {
                            $scope.showHideTest = false;
                            $scope.dialog.second = "Put image link"
                        } else if (val == 3) {
                            $scope.showHideTest = false;
                            $scope.dialog.second = "Put WebSite link"
                        }
                    };


                    $scope.hide = function () {
                        $mdDialog.hide();
                    };
                    $scope.cancel = function () {
                        $mdDialog.cancel();
                    };
                    $scope.answer = function (answer) {
                        $mdDialog.hide(answer);
                    };
                }

            }
        }
    }]);
const  sitelink = "http://godaddyserver/";

mainapp.service('getData', ['$http', '$cookies','$location', function ($http, $cookies,$location) {

    var favoriteCookie = $cookies.getObject('globals');
    var sitelink = "http://godaddyserver/";

    this.getCustomList = function ($type) {
        if (favoriteCookie) {
            var responseansw = $http({
                method: 'GET',
                headers: {
                    'Accept': 'application/json', //text/javascript
                    'Content-Type': 'application/json; charset=utf-8',
                    'authorization': 'Bearer ' + favoriteCookie.currentUser.authdata
                },
                url: sitelink + "api/1.0/notes/" + $type
            });
            return responseansw;
        } else {
            var response = $http({
                method: "GET",
                url: sitelink + "api/1.0/all"
            });
            return response;
        }

    };

    this.getAllNotes = function () {
        if (favoriteCookie) {
            var response = $http({
                method: "GET",
                headers: {
                    'Accept': 'application/json', //text/javascript
                    'Content-Type': 'application/json; charset=utf-8',
                    'authorization': 'Bearer ' + favoriteCookie.currentUser.authdata
                },
                url: sitelink + "api/1.0/all"
            });
            return response;
        } else {
            var response = $http({
                method: "GET",
                url: sitelink + "api/1.0/all"
            });
            return response;
        }
    };

    //SENT NOTE TO TRASH
    this.removeNote = function (noteId) {
        var response = $http({
            method: "POST",
            headers: {
                'Accept': 'application/json', //text/javascript
                'Content-Type': 'application/json; charset=utf-8',
                'authorization': 'Bearer ' + favoriteCookie.currentUser.authdata
            },
            data: {'id': noteId},
            url: sitelink + "api/1.0/senttotrash"
        });
        return response;
    };

    //UPDATE NOTE
    this.updateNote = function (dataToPass) {
        var response = $http({
            method: "POST",
            headers: {
                'Accept': 'application/json', //text/javascript
                'Content-Type': 'application/json; charset=utf-8',
                'authorization': 'Bearer ' + favoriteCookie.currentUser.authdata
            },
            data: JSON.stringify(dataToPass),

            url: sitelink + "api/1.0/updatenote"
        });
        return response;
    };

    //ADD NOTE
    this.addNote = function (dataToPass) {
        var response = $http({
            method: "POST",
            headers: {
                'Accept': 'application/json', //text/javascript
                'Content-Type': 'application/json; charset=utf-8',
                'authorization': 'Bearer ' + favoriteCookie.currentUser.authdata
            },
            data: JSON.stringify(dataToPass),

            url: sitelink + "api/1.0/addnote"
        });
        return response;
    };

    // SENT BACK TO NOTES
    this.sentBackToNotes = function (noteId) {
        var response = $http({
            method: "POST",
            headers: {
                'Accept': 'application/json', //text/javascript
                'Content-Type': 'application/json; charset=utf-8',
                'authorization': 'Bearer ' + favoriteCookie.currentUser.authdata
            },
            data: {'id': noteId},
            url: sitelink + "api/1.0/sentbacktonotes"
        });
        return response;
    };

    // CHANGE COLOR OF NOTE
    this.changeColorService = function (noteId, boja) {
        var response = $http({
            method: "POST",
            headers: {
                'Accept': 'application/json', //text/javascript
                'Content-Type': 'application/json; charset=utf-8',
                'authorization': 'Bearer ' + favoriteCookie.currentUser.authdata
            },
            data: {'id': noteId, 'color': boja},
            url: sitelink + "api/1.0/updatecolor"
        });
        return response;
    };


    // FULL REMOVE NOTE
    this.fullRemoveFromNotesService = function (noteId) {

        var response = $http({
            method: "POST",
            headers: {
                'Accept': 'application/json', //text/javascript
                'Content-Type': 'application/json; charset=utf-8',
                'authorization': 'Bearer ' + favoriteCookie.currentUser.authdata
            },
            data: {'id': noteId},
            url: sitelink + "api/1.0/deletenote"
        });
        return response;

    };

}]);


mainapp.factory('LoginService',['$http','website','$cookies', function ($http, website, $cookies) {

    var favoriteCookie = $cookies.getObject('globals');

    
    var isAuthenticated = false;
    return {
        login: function (email, password) {
            var responser = $http({
                method: "POST",
                data: {'email': email, 'password': password},
                url: website + "userLogin"
            });
            return responser;
        },
        isAuthenticated: function () {
            console.log('isAuthenticated');
        },
        validatelogin: function () {

            if (favoriteCookie) {
                var responser = $http({
                    method: "POST",
                    headers: {
                        'Accept': 'application/json', //text/javascript
                        'Content-Type': 'application/json; charset=utf-8',
                        'authorization': 'Bearer ' + favoriteCookie.currentUser.authdata
                    },
                    url: sitelink + "api/1.0/userdetail"
                });
                return responser;
            } else {
                objerr = {};
                objerr.success = false;
                var jsobj = JSON.stringify(objerr);
                return 'asdas'
            }


        },
    };
}]);


mainapp.service('hexafy', function () {
    this.myFunc = function (x) {
        return x.toString(16);
    };

});




