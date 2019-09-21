ngApp.controller('myCtrl', ['$scope', '$rootScope', '$timeout', '$http', '$location', '$state', '$window', function ($scope, $rootScope, $timeout, $http, $location, $state, $window) {
    //$scope.rootURL = "http://localhost:8000/crud/";
    $scope.rootURL = "http://192.168.1.135:8000/crud/";
    $scope.imageURL = "http://192.168.1.135/group-creator-backend/uploads/";
    $scope.mainLoaderIs = true;
    $scope.allMembersList = [];
    $scope.selMembersList = [];
    $scope.unSelMembersList = [];
    $scope.createdGroupList = [];
    $scope.checkRandomNo = [];
    $scope.membersCount = 5;
    $scope.groupsCount = 1;

    $scope.goBackFun = function () {
        $window.history.back();
    };

    $scope.randomNoCreator = function () {
        for (var a = $scope.checkRandomNo, i = a.length; i--;) {
            var random = a.splice(Math.floor(Math.random() * (i + 1)), 1)[0];
            return random;
        }
    };

    $scope.autoCreateGroup = function () {
        for (var r = 0; r < $scope.selMembersList.length; r++) {
            $scope.checkRandomNo.push(r);
        }
        for (var g = 0; g < $scope.groupsCount; g++) {
            var group = [];
            for (var i = 0; i < $scope.membersCount; i++) {
                var getIndex = 0;
                if (group.length < $scope.membersCount) {
                    getIndex = $scope.randomNoCreator();
                    group.push($scope.selMembersList[getIndex]);
                } else {
                    break;
                }
            }
            $scope.createdGroupList.push(group);
        }
    };

    $scope.reloadFun = function (params) {
        if (params == 'onload') {
            $scope.createdGroupList = [];
            $scope.checkRandomNo = [];
            $scope.membersInGroup = [];
            $scope.selMembersList = [];
            $http({
                method: 'GET',
                url: $scope.rootURL + "getEmpList",
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(function (response) {
                console.log("response", response);
                if (response.data.success) {
                    var dataList = response.data.data;
                    for (let l = 0; l < dataList.length; l++) {
                        if (dataList[l].image != "" && dataList[l].image != undefined) {
                            dataList[l].imageFullPath = $scope.imageURL + dataList[l].image;
                        }
                        if (dataList[l].status == 1) {
                            $scope.selMembersList.push(dataList[l]);
                        }
                        $scope.allMembersList.push(dataList[l]);
                    }
                    //$scope.selMembersList = angular.copy(dataList);
                    $scope.autoCreateGroup();
                } else {
                    alert('Error :' + response.data.message);
                }
            });
        } else {
            $scope.createdGroupList = [];
            $scope.checkRandomNo = [];
            $scope.membersInGroup = [];
            $scope.autoCreateGroup();
        }
    };

    $scope.memrsListViewOpenIs = false;
    $scope.addMembersFromAll = function () {
        if ($scope.memrsListViewOpenIs) {
            $scope.memrsListViewOpenIs = false;
        } else {
            $scope.unSelMembersList = [];
            var loopLength = $scope.selMembersList.length - 1;
            for (var i = 0; i < $scope.allMembersList.length; i++) {
                if ($scope.selMembersList.length > 0) {
                    for (var g = 0; g < $scope.selMembersList.length; g++) {
                        if ($scope.allMembersList[i].id == $scope.selMembersList[g].id) {
                            break;
                        } else {
                            if (g == loopLength) {
                                $scope.unSelMembersList.push($scope.allMembersList[i]);
                            }
                        }
                    }
                } else {
                    $scope.unSelMembersList.push($scope.allMembersList[i]);
                }
            }
            $scope.memrsListViewOpenIs = true;
        }
    };

    $scope.removeFromSelList = function (fromList, getIndexObj) {
        var postData = {
            "status": 0,
            "emp_id": 0
        };
        if (fromList == "selList") {
            postData.emp_id = getIndexObj.id;
            $scope.unSelMembersList.push(getIndexObj);
            $scope.selMembersList.splice($scope.selMembersList.indexOf(getIndexObj), 1);
            postData.status = 0;
        }
        if (fromList == "allList") {
            postData.emp_id = getIndexObj.id;
            $scope.selMembersList.push(getIndexObj);
            $scope.unSelMembersList.splice($scope.unSelMembersList.indexOf(getIndexObj), 1);
            postData.status = 1;
        }
        if (fromList == "clearAll") {
            postData.status = "all";
            $scope.selMembersList = angular.copy($scope.allMembersList);
            $scope.unSelMembersList = [];
            $scope.memrsListViewOpenIs = false;
        }
        $http({
            method: 'POST',
            url: $scope.rootURL + "changeEmpStatus",
            headers: {
                "Content-Type": "application/json"
            },
            data: postData
        }).then(function (response) {
            console.log("response", response);
            if (response.data.success) {
                console.log(response.data.message);
            } else {
                alert('Error :' + response.data.message);
            }
        });
    };

    // goMembersListPage
    $scope.goMembersListPage = function () {
        $state.go('memberList');
    };

    $timeout(function () {
        $scope.mainLoaderIs = false;
    }, 1000);



    /*Creating IndexedDB*/
    /* var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    var IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction || {
        READ_WRITE: "readwrite"
    };
    var IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
    if (!indexedDB) {
        var msg = "Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.";
        alert(msg);
    } else {
        //console.log("DB created");
    }
    //Get Unique ID
    $scope.getUniqueNo = function () {
        var uniqueId = new Date().getTime();
        return uniqueId;
    } */


    //var db, request;
    /* $scope.db = {};
    $scope.request = {};
    $scope.all_list_table = 'allList';
    $scope.group_list_table = 'groupList';
    var dataTables = [{
        "tableName": 'allList',
        "keyPath": 'id'
    }, {
        "tableName": 'groupList',
        "keyPath": 'id'
    }]; */
    /*DB Creation*/
    /* $scope.dbCreation = function () {
        $scope.request = indexedDB.open('groupMakerDB', 8);
        $scope.request.onerror = function (event) {
            // Handle errors.
        };
        $scope.request.onupgradeneeded = function (event) {
            $scope.db = event.target.result;
            for (var d = 0; d < dataTables.length; d++) {
                if (!$scope.db.objectStoreNames.contains(dataTables[d].tableName)) {
                    var dataStorage = event.currentTarget.result.createObjectStore(dataTables[d].tableName, {
                        keyPath: dataTables[d].keyPath,
                        autoIncrement: true
                    });
                }
            }
        };
        $scope.request.onsuccess = function (evt) {
            $scope.db = this.result;
        };
    }
    $scope.dbCreation(); */
    /*Changes End*/


    /* $scope.addListFun = function () {
        var storeList = [{
            "name": "Jamal Mohammed",
            "age": "25",
            "team": "UI"
        }, {
            "name": "Mohammed",
            "age": "25",
            "team": "UX"
        }, {
            "name": "Mahesh",
            "age": "25",
            "team": "BE"
        }];
        var get_db_request = $scope.db.transaction([$scope.all_list_table], "readwrite").objectStore($scope.all_list_table);

        for (var n = 0; n < storeList.length; n++) {
            var obj = storeList[n];

            var id_length = 8,
                crnt_date = new Date();
            var id_timestamp = crnt_date.getDate() + "" + crnt_date.getMonth() + "" + crnt_date.getFullYear() + "" + crnt_date.getHours() + "" + crnt_date.getMinutes() + "" + crnt_date.getSeconds();

            var get_random_int = function (min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }

            var index = get_random_int(0, (id_length - 1));

            var uniqe_id = id_timestamp + index + obj.name;

            console.log("uniqe_id", uniqe_id);

            obj.id = uniqe_id;
            var addingList = get_db_request.add(obj);

            addingList.onsuccess = function (event) {
                console.log("addingList", addingList);
            };
        }
    };

    $scope.getFun = function () {
        var get_db_request = $scope.db.transaction([$scope.all_list_table], "readwrite").objectStore($scope.all_list_table);

        var get_parti_list = get_db_request.get("Jamal Mohammed");
        get_parti_list.onsuccess = function (event) {
            console.log("get_parti_list", get_parti_list.result);
        };
    }; */

}]);