var ngApp = angular.module('myApp', ['ngRoute']);
ngApp.config(['$routeProvider', function config($routeProvider) {
    $routeProvider.when('/home', {
        templateUrl: "templates/home.html",
        controller: "myCtrl"
    }).when('/phones', {
        template: '<div>second page</div>'
    }).otherwise('/home');
}]);