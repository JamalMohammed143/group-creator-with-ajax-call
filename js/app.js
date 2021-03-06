var ngApp = angular.module('myApp', ['ui.router', 'ngStorage']);

ngApp.config(['$stateProvider', function ($stateProvider) {
    $stateProvider.state('login', {
        url: '/login',
        templateUrl: "templates/login.html",
        controller: 'myCtrl',
    }).state('home', {
        url: '/home',
        templateUrl: "templates/home.html",
        controller: 'homeCtrl',
    }).state('memberList', {
        url: '/memberList',
        templateUrl: "templates/members.html",
        controller: 'membersCtrl',
    });
}]);

ngApp.config(['$urlRouterProvider', function ($urlRouterProvider) {
    $urlRouterProvider.otherwise('/login');
}]);