var mainapp = angular.module('mainapp');

mainapp.controller('notes', ['$scope', 'getData', function ($scope, getData) {
    $scope.name = 'notes';

    var allNotesVal = getData.getCustomList(1);
    allNotesVal.then(function (emp) {
        if (emp.data.success) {
            $scope.listnotes = emp.data.data;
        } else {
            console.log("Empty notes 11 -> remove for production");
        }
    }, function () {
        console.log("Error -> no data- remove for production");
    });

}]);

mainapp.controller('images', ['$scope', 'getData', function ($scope, getData) {
    $scope.name = 'images';

    var allNotesVal = getData.getCustomList(2);
    allNotesVal.then(function (emp) {
        if (emp.data.success) {
            $scope.listnotes = emp.data.data;
        } else {
            console.log("Empty notes 27 -> remove for production");
        }
    }, function () {
        console.log("Error ->  -> no data- remove for production");
    });

}]);

mainapp.controller('links', ['$scope', 'getData', function ($scope, getData) {
    $scope.name = 'links';

    var allNotesVal = getData.getCustomList(3);
    allNotesVal.then(function (emp) {
        if (emp.data.success) {
            $scope.listnotes = emp.data.data;
        } else {
            console.log("Empty  notes 43 -> remove for production");
        }
    }, function () {
        console.log("Error -> no data- remove for production");
    });

}]);

mainapp.controller('trash', ['$scope', 'getData', 'testfactory', function ($scope, getData, testfactory) {
    $scope.name = 'trash';

    GetAllNotes();
    function GetAllNotes() {
        var allNotesVal = getData.getAllNotes();
        allNotesVal.then(function (emp) {
            if (emp.data.success) {
                $scope.listnotes = emp.data.data;
                $scope.loading = false;
                testfactory.listnotes = $scope.listnotes;
            } else {
                console.log("empty notes 63 -> remove for production");
            }
        }, function () {

        });
    }

    $scope.backtoNodes = function ($event, note, $index) {
        getDataDel = getData.sentBackToNotes(note.id);
        getDataDel.then(function (msg) {
            if (msg.data.success) {
                $scope.status = msg.data.error_msg;

                $index = $scope.listnotes.indexOf(note);
                $scope.listnotes.splice($index, 1);

            } else {
                alert('Node is NOT  Activated');
            }
        }, function () {
            alert('Error in SENT BACK TO NOTES');
        });
    };


    // this is to FULL REMOVE FROM SERVER
    $scope.fullRemovefromNodes = function ($event, note, $index) {
        getDataDel = getData.fullRemoveFromNotesService(note.id);
        getDataDel.then(function (msg) {
            if (msg.data.success) {
                $index = $scope.listnotes.indexOf(note);
                $scope.listnotes.splice($index, 1);
            } else {
                alert('Node is NOT DELETED');
            }
        }, function () {
            alert('Error in Deleting Record');
        });
    };
}]);


mainapp.directive('notesContent', ['getData', '$mdDialog', function (getData, $mdDialog) {
    return {
        templateUrl: '../template/include/fourbuttons.html',
        link: function ($scope, $element, $attrs) {


            // UPDATE COLOR
            $scope.changeColor = function ($event, note, $idColor) {
                idnote = note.id;
                var getNoteData = getData.changeColorService(idnote, $idColor);
                getNoteData.then(function (msg) {
                    if (msg.data.success) {
                        $scope.note.color = $idColor;
                    } else {
                        alert(msg.data.message);
                    }
                }, function () {
                    alert('Error in Updata COLOR Record');
                });
            };

            // SENT TO TRASH
            $scope.deleteRecord = function ($event, note, $index) {
                idjsdel = note.id;
                var getDataDel = getData.removeNote(idjsdel);
                getDataDel.then(function (msg) {
                    if (msg.data.success) {
                        $index = $scope.listnotes.indexOf(note);
                        $scope.listnotes.splice($index, 1);
                    } else {
                        alert(msg.data.message);
                    }
                }, function () {
                    alert('Error in Deleting Record');
                });
            }

            // UPDATE NODE
            $scope.editRecord = function (ev, note, $index) {
                idjsdel = note.id;

                function DialogController_update($scope, $mdDialog, dataToPass) {

                    var vm = this;
                    $scope.formdata = dataToPass;
                    $scope.showHideTest = true;
                    $scope.dialog = {
                        first: "Title",
                        second: "Text Note"
                    };
                    var rbval = $scope.formdata.typenote;
                    getSelect(rbval);

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


                $mdDialog.show({
                    controller: DialogController_update,
                    templateUrl: '../template/dialog.html?t=' + Math.random(),
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    fullscreen: $scope.customFullscreen,
                    locals: {dataToPass: note},

                })
                    .then(function (answer) {

                        if (answer == 0) {
                            $scope.status = "You say no to edit :) "
                        } else {

                            var getDataDel = getData.updateNote(note);
                            getDataDel.then(function (msg) {
                                if (msg.data.success) {
                                    //$scope.note.typenote = 1;
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
            }
        }
    }
}]);