ngApp.controller('myCtrl', ['$scope', '$timeout', '$http', function ($scope, $timeout, $http) {
    //$scope.rootURL = "http://localhost:8000/crud/";
    $scope.rootURL = "http://192.168.1.135:8000/crud/";
    $scope.mainLoaderIs = true;
    $scope.allMembersList = [];
    $scope.selMembersList = [];
    $scope.unSelMembersList = [];
    $scope.createdGroupList = [];
    $scope.checkRandomNo = [];
    $scope.membersCount = 5;
    $scope.groupsCount = 4;
    $scope.updateEmpDetailIs = false;
    $scope.membersObj = {
        "name": "",
        "empId": "",
        "gender": "male",
        "department": "",
        "image": ""
    };

    $scope.addAndUpdateEmp = function () {
        $scope.mainLoaderIs = true;
        var data = angular.copy($scope.membersObj);
        var callingFun = "";
        if ($scope.updateEmpDetailIs) {
            data.emp_id = data.id;
            callingFun = "updateEmployee";
        } else {
            callingFun = "createNewEmployee";
        }
        $http({
            method: 'POST',
            url: $scope.rootURL + callingFun,
            headers: {
                "Content-Type": "application/json"
            },
            data: data
        }).then(function (response) {
            if (response.data.success) {
                alert(response.data.message);
                $('#memberAddModal').modal('hide');
                $scope.reloadFun('onload');
            } else {
                alert('Error :' + response.data.message);
            }
            $scope.mainLoaderIs = false;
        });
    };

    $scope.editAndAddEmp = function (params) {
        if (params == 'add') {
            $scope.membersObj.name = "";
            $scope.membersObj.empId = "";
            $scope.membersObj.gender = "male";
            $scope.membersObj.department = "";
            $scope.membersObj.image = "";
            $scope.updateEmpDetailIs = false;
            $('#memberAddModal').modal('show');
        } else {
            $scope.updateEmpDetailIs = true;
            $scope.membersObj = angular.copy(params);
            $('#membersListModal').modal('hide');
            $('#memberAddModal').modal('show');
        }
    };

    $scope.deleteEmp = function (empid) {
        if (confirm("Do you want to delete this person?")) {
            $http({
                method: 'GET',
                url: $scope.rootURL + "deleteEmployee?emp_id=" + empid,
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(function (response) {
                if (response.data.success) {
                    alert(response.data.message);
                    $scope.reloadFun('onload');
                } else {
                    alert('Error :' + response.data.message);
                }
                $scope.mainLoaderIs = false;
            });
        }
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

    $scope.removeFromSelList = function (fromList, getIndex) {
        if (fromList == "selList") {
            $scope.unSelMembersList.push($scope.selMembersList[getIndex]);
            $scope.selMembersList.splice(getIndex, 1);
        } else {
            $scope.selMembersList.push($scope.unSelMembersList[getIndex]);
            $scope.unSelMembersList.splice(getIndex, 1);
        }
    };

    $scope.reloadFun = function (params) {
        if (params == 'onload') {
            $scope.mainLoaderIs = true;
            $scope.createdGroupList = [];
            $scope.checkRandomNo = [];
            $scope.membersInGroup = [];
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
                    $scope.allMembersList = angular.copy(dataList);
                    $scope.selMembersList = angular.copy(dataList);
                    $scope.autoCreateGroup();
                } else {
                    alert('Error :' + response.data.message);
                }
                $scope.mainLoaderIs = false;
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
                for (var g = 0; g < $scope.selMembersList.length; g++) {
                    if ($scope.allMembersList[i].id == $scope.selMembersList[g].id) {
                        break;
                    } else {
                        if (g == loopLength) {
                            $scope.unSelMembersList.push($scope.allMembersList[i]);
                        }
                    }
                }
            }
            $scope.memrsListViewOpenIs = true;
        }
    };

    var getElement, croppingElement;
    $scope.imageUplading = function () {
        $('#croppingContainer').show();
        getElement = document.getElementById('imageCroppingBox');
        var imageObject = document.getElementById('profilePhotoUploader').files[0];
        var img_src = URL.createObjectURL(imageObject);
        croppingElement = new Croppie(getElement, {
            viewport: {
                width: 150,
                height: 150,
                type: 'circle'
            },
            boundary: {
                width: 200,
                height: 200
            },
            showZoomer: false
        });
        croppingElement.bind({
            url: img_src,
            orientation: 4
        });
    };

    $scope.destroyTheCropping = function () {
        croppingElement.destroy();
        $('#profilePhotoUploader').val(null);
        $('#croppingContainer').hide();
    };

    $scope.cancelAll = function () {
        $('#croppedImageViewer').hide();
        $('#photoUploadingLabel').show();
    };

    $scope.getCroppedImage = function () {
        croppingElement.result('base64').then(function (result) {
            $('#croppedImageViewer img').attr('src', result);
            //$scope.membersObj.image = result;
        });
        croppingElement.result('blob').then(function (result) {
            var imageFile = new File([result], "newPhoto.png");
            console.log('imageFile', imageFile);

            var fileData = new FormData();
            fileData.append("file", imageFile);

            // $http.post($scope.rootURL + 'uploadImage', fileData, {
            //     headers: {
            //         'Content-Type': undefined
            //     }
            // }).success(function (result) {
            //     console.log('result', result);
            // }).error(function (error) {
            //     console.log('error', error);
            // });
            $http.post($scope.rootURL + 'uploadImage', fileData, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                }
            }).then(function (result) {
                console.log('result', result);
            });
        });
        croppingElement.destroy();
        $('#profilePhotoUploader').val(null);
        $('#croppingContainer, #photoUploadingLabel').hide();
        $('#croppedImageViewer').show();
    };

    $('#memberAddModal').on('hide.bs.modal', function (event) {
        if ($('#profilePhotoUploader').val()) {
            croppingElement.destroy();
            $('#profilePhotoUploader').val(null);
        }
        $('#croppingContainer, #croppedImageViewer').hide();
        $('#photoUploadingLabel').show();
    });

    $timeout(function () {
        $scope.mainLoaderIs = false;
    }, 1000);
}]);