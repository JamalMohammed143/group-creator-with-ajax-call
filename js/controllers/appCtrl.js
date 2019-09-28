ngApp.controller('myCtrl', ['$scope', '$rootScope', '$timeout', '$http', '$location', '$state', '$window', function ($scope, $rootScope, $timeout, $http, $location, $state, $window) {
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

    $scope.validatingAuthentication = function () {
        console.log("$scope.loginObj", $scope.loginObj);
        if ($scope.loginObj.email != "" && $scope.loginObj.email != undefined && $scope.loginObj.password != "" && $scope.loginObj.password != undefined) {
            var data = $scope.loginObj;
            $http({
                method: "POST",
                url: $scope.rootURL + "login",
                headers: {
                    "Content-Type": "application/json"
                },
                data: data
            }).then(function (response) {
                console.log("response", response);
                if (response.data.success) {
                    var dataList = response.data.data;
                    alert("Login Successfuly...");
                    //$state.go("home");
                } else {
                    alert('Error :' + response.data.message);
                }
            });
        } else {
            alert("Please fill the credentials");
        }
    };

    $timeout(function () {
        $scope.mainLoaderIs = false;
    }, 1000);
}]);