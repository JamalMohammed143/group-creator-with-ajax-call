ngApp.controller('membersCtrl', ['$scope', '$timeout', '$http', '$location', '$state', '$window', function ($scope, $timeout, $http, $location, $state, $window) {
    //$scope.rootURL = "http://localhost:8000/crud/";
    $scope.rootURL = "http://192.168.1.135:8000/crud/";
    $scope.imageURL = "http://192.168.1.135/myFirstNodeJs/uploads/";
    $scope.mainLoaderIs = true;
    $scope.allMembersList = [];
    $scope.updateEmpDetailIs = false;
    $scope.membersObj = {
        "name": "",
        "empId": "",
        "gender": "male",
        "department": "",
        "image": ""
    };

    $scope.goBackFun = function () {
        $window.history.back();
    };
    $scope.reloadFun = function () {
        $scope.mainLoaderIs = true;
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
                    $scope.allMembersList.push(dataList[l]);
                }
            } else {
                alert('Error :' + response.data.message);
            }
            $scope.mainLoaderIs = false;
        });
    };
    $scope.reloadFun();

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
        // croppingElement.result('base64').then(function (result) {
        //     $('#croppedImageViewer img').attr('src', result);
        //     //$scope.membersObj.image = result;
        // });
        croppingElement.result('blob').then(function (result) {
            var createFileName = $scope.membersObj.name.split(" ");
            var fileName = createFileName.join("_") + ".png";
            var imageFile = new File([result], fileName);
            console.log('imageFile', imageFile);
            var formData = new FormData();
            formData.append('File', imageFile);
            formData.append('emp_id', $scope.membersObj.id);
            formData.append('name', $scope.membersObj.name);

            $http.post($scope.rootURL + "uploadImage", formData, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                },
                async: false,
            }).then(function (response) {
                console.log('response', response);
                if (response.data.success) {} else {}
            }, function (error) {
                console.log('error', error);
            });
        });
        croppingElement.destroy();
        $('#profilePhotoUploader').val(null);
        $('#croppingContainer, #photoUploadingLabel').hide();
        $('#croppedImageViewer').show();
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