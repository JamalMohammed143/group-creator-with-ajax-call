ngApp.controller('membersCtrl', ['$scope', '$rootScope', '$timeout', '$http', '$location', '$state', '$window', function ($scope, $rootScope, $timeout, $http, $location, $state, $window) {
    //$scope.rootURL = "http://localhost:8000/crud/";
    $scope.rootURL = "http://192.168.1.135:8000/crud/";
    $scope.imageURL = "http://192.168.1.135/group-creator-backend/uploads/";
    $rootScope.separateLoaderIs = false;
    $scope.allMembersList = [];
    $scope.updateEmpDetailIs = false;
    $scope.imageFileObj = {};
    $scope.membersObj = {
        "name": "",
        "empId": "",
        "gender": "male",
        "department": ""
    };

    $scope.goBackFun = function () {
        $window.history.back();
    };
    $scope.getAllEmpList = function () {
        $http({
            method: 'GET',
            url: $scope.rootURL + "getEmpList",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response) {
            $scope.allMembersList = [];
            if (response.data.success) {
                var dataList = response.data.data;
                for (let l = 0; l < dataList.length; l++) {
                    if (dataList[l].image != "") {
                        dataList[l].image = $scope.imageURL + dataList[l].image;
                    }
                    $scope.allMembersList.push(dataList[l]);
                }
            } else {
                alert('Error :' + response.data.message);
            }
            $rootScope.separateLoaderIs = false;
        });
    };
    $scope.getAllEmpList();

    var getElement, croppingElement;
    $scope.imageUploading = function () {
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
        $scope.imageFileObj = {};
    };

    $scope.getCroppedImage = function () {
        croppingElement.result('base64').then(function (result) {
            $('#croppedImageViewer img').attr('src', result);
        });
        croppingElement.result('blob').then(function (result) {
            $scope.imageFileObj = result;
        });
        croppingElement.destroy();
        $('#profilePhotoUploader').val(null);
        $('#croppingContainer, #photoUploadingLabel').hide();
        $('#croppedImageViewer').show();
    };

    $scope.addAndUpdateEmp = function () {
        if ($scope.membersObj.name != "" && $scope.membersObj.name != undefined && $scope.membersObj.empId != "" && $scope.membersObj.empId != undefined && $scope.membersObj.department != "" && $scope.membersObj.department != undefined) {
            $rootScope.separateLoaderIs = true;
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
                    $scope.profileImageUploading(response.data.data, response.data.message);
                } else {
                    alert('Error :' + response.data.message);
                }
                //$rootScope.separateLoaderIs = false;
            }, function (error) {
                $rootScope.separateLoaderIs = false;
                console.log('error', error);
            });
        } else {
            alert("Fill the all info...");
        }
    };

    $scope.profileImageUploading = function (emp_id, alertMsg) {
        if ($scope.imageFileObj.type != "" && $scope.imageFileObj.type != undefined) {
            //var createFileName = $scope.membersObj.name.split(" ");
            var fileName = "profile_image_" + emp_id + ".png";
            var imageFile = new File([$scope.imageFileObj], fileName);
            var formData = new FormData();
            formData.append('File', imageFile);
            formData.append('emp_id', emp_id);
            $http.post($scope.rootURL + "uploadImage", formData, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                },
                async: false,
            }).then(function (response) {
                if (response.data.success) {
                    alert(alertMsg);
                    $scope.allMembersList = [];
                    $timeout(function () {
                        $scope.getAllEmpList();
                    }, 500);
                    $('#memberAddModal').modal('hide');
                } else {
                    alert(response.data.message);
                }
                $rootScope.separateLoaderIs = false;
            }, function (error) {
                $rootScope.separateLoaderIs = false;
                console.log('error', error);
            });
        } else {
            alert(alertMsg);
            $scope.getAllEmpList();
            $('#memberAddModal').modal('hide');
        }
    };

    $scope.editAndAddEmp = function (params) {
        $scope.imageFileObj = {};
        if (params == 'add') {
            $scope.membersObj.name = "";
            $scope.membersObj.empId = "";
            $scope.membersObj.gender = "male";
            $scope.membersObj.department = "";
            $scope.updateEmpDetailIs = false;
            $('#memberAddModal').modal('show');
        } else {
            if (params.image != "") {
                $('#croppedImageViewer img').attr('src', params.image);
                $('#croppingContainer, #photoUploadingLabel').hide();
                $('#croppedImageViewer').show();
            }
            $scope.updateEmpDetailIs = true;
            $scope.membersObj = angular.copy(params);
            $('#memberAddModal').modal('show');
        }
    };

    $scope.deleteEmp = function (empid) {
        if (confirm("Do you want to delete this person?")) {
            $rootScope.separateLoaderIs = true;
            $http({
                method: 'GET',
                url: $scope.rootURL + "deleteEmployee?emp_id=" + empid,
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(function (response) {
                if (response.data.success) {
                    alert(response.data.message);
                    $scope.getAllEmpList();
                } else {
                    alert('Error :' + response.data.message);
                }
            });
        }
    };

    $('#memberAddModal').on('hide.bs.modal', function (event) {
        if ($('#profilePhotoUploader').val()) {
            croppingElement.destroy();
            $scope.imageFileObj = {};
            $('#profilePhotoUploader').val(null);
        }
        $('#croppingContainer, #croppedImageViewer').hide();
        $('#photoUploadingLabel').show();
    });
}]);