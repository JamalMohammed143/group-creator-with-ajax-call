ngApp.controller('myCtrl', ['$scope', '$rootScope', '$timeout', '$http', '$location', '$state', '$window', '$sessionStorage', function ($scope, $rootScope, $timeout, $http, $location, $state, $window, $sessionStorage) {
    //$scope.rootURL = "http://localhost:8000/crud/";
    $scope.rootURL = "http://192.168.1.135:8000/crud/";
    $scope.imageURL = "http://192.168.1.135/group-creator-backend/uploads/";
    $scope.mainLoaderIs = true;
    $scope.mainHeaderShownIs = false;

    $scope.loginObj = {
        "email": "",
        "password": "",
        "rememberIs": false
    };
    $scope.signInObj = {
        "email": "",
        "crtePassword": "",
        "confirmPassword": ""
    };

    $scope.userLoginEmail = "";
    $scope.loginCheck = function () {
        $scope.userLoginEmail = $sessionStorage.userLoginEmail;
        if ($sessionStorage.userLoginEmail != undefined && $sessionStorage.userLoginEmail != "") {
            $state.go("home");
        } else {
            $state.go("login");
        }
    };
    $scope.loginCheck();

    $scope.logoutUser = function () {
        $sessionStorage.userLoginEmail = "";
        $state.go("login");
    };

    $scope.$watch(function () {
        return $state.$current.name;
    }, function (newVal, oldVal) {
        var state = newVal;
        if (state != 'login') {
            $scope.mainHeaderShownIs = true;
        } else {
            $scope.mainHeaderShownIs = false;
        }
    });

    $scope.logInFormSubmit = function () {
        var loginObj = $scope.loginObj;
        if (loginObj.email != "" && loginObj.email != undefined && loginObj.password != "" && loginObj.password != undefined) {
            var sendData = {
                "email": loginObj.email,
                "password": btoa(loginObj.password)
            };
            $http({
                method: "POST",
                url: $scope.rootURL + "login",
                headers: {
                    "Content-Type": "application/json"
                },
                data: sendData
            }).then(function (response) {
                var resDataObj = response.data;
                if (resDataObj.success) {
                    alert(resDataObj.message);
                    $sessionStorage.userLoginEmail = loginObj.email;
                    /* if (loginObj.rememberIs) {
                    } else {
                        $sessionStorage.userLoginIs = false;
                    } */
                    $state.go("home");
                } else {
                    alert('Error: ' + resDataObj.message);
                }
            });
        } else {
            if (loginObj.email == "" || loginObj.email == undefined) {
                alert("Please enter email");
            }
            if (loginObj.password == "" || loginObj.password == undefined) {
                alert("Please enter password");
            }
        }
    };

    $scope.signInFormSubmit = function () {
        var getObject = $scope.signInObj;
        if (getObject.email != "" && getObject.email != undefined && getObject.crtePassword != "" && getObject.crtePassword != undefined && getObject.confirmPassword != "" && getObject.confirmPassword != undefined) {
            if (getObject.crtePassword == getObject.confirmPassword) {
                var sendData = {
                    "email": getObject.email,
                    "password": btoa(getObject.crtePassword)
                };
                console.log("sendData", sendData);
                $http({
                    method: "POST",
                    url: $scope.rootURL + "register",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    data: sendData
                }).then(function (response) {
                    var resDataObj = response.data;
                    if (resDataObj.success) {
                        alert(resDataObj.message);
                        $sessionStorage.userLoginEmail = getObject.email;
                        $state.go("home");
                    } else {
                        alert('Error: ' + resDataObj.message);
                    }
                });
            } else {
                alert("Password and confirm password doesn\'t match.");
            }
        } else {
            if (getObject.email == "" || getObject.email == undefined) {
                alert("Please enter email");
            }
            if (getObject.crtePassword == "" || getObject.crtePassword == undefined) {
                alert("please enter new password");
            }
            if (getObject.confirmPassword == "" || getObject.confirmPassword == undefined) {
                alert("Please enter confirm password");
            }
        }
    };

    $scope.signInSectionIs = false;
    $scope.goToSignInSection = function () {
        $scope.signInSectionIs = !$scope.signInSectionIs;
    };

    $timeout(function () {
        $scope.mainLoaderIs = false;
    }, 1000);
}]);