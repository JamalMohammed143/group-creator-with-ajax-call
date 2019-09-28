var ngApp = angular.module('myApp', ['ui.router']);

ngApp.config(['$stateProvider', function ($stateProvider) {
    $stateProvider.state('home', {
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
    $urlRouterProvider.otherwise('/home');
}]);