ngApp.controller('myCtrl', ['$scope', '$rootScope', '$timeout', '$http', '$location', '$state', '$window', function ($scope, $rootScope, $timeout, $http, $location, $state, $window) {
    //$scope.rootURL = "http://localhost:8000/crud/";
    $scope.rootURL = "http://192.168.1.135:8000/crud/";
    $scope.imageURL = "http://192.168.1.135/myFirstNodeJs/uploads/";
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
                        if (dataList[l].image != "") {
                            dataList[l].image = $scope.imageURL + dataList[l].image;
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
}]);