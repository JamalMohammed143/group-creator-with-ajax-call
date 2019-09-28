ngApp.controller('myCtrl', ['$scope', '$rootScope', '$timeout', '$http', '$location', '$state', '$window', function ($scope, $rootScope, $timeout, $http, $location, $state, $window) {
    //$scope.rootURL = "http://localhost:8000/crud/";
    $scope.rootURL = "http://192.168.1.135:8000/crud/";
    $scope.imageURL = "http://192.168.1.135/group-creator-backend/uploads/";
    $scope.mainLoaderIs = true;

    $timeout(function () {
        $scope.mainLoaderIs = false;
    }, 1000);
}]);