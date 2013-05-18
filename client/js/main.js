'use strict';

require(['project-text!html/home.html', 'angular'], function (homeTemplate) {

    // namespace

    if (!window.namespace) {
        window.namespace = {};
    }

    // angular service

    angular.module('project.service', []).factory('$logger', [function () {
        return {
            log: function (msg) {
                console.log(msg);
            }
        };
    }]);

    // angular directive

    angular.module('project.directive', []).directive('ngReady', function () {
        return {
            link: function ($scope, elem, attrs, ctrl) {
                angular.element(document).ready(function () {
                    console.log('angular app is ready');
                });
            }
        };
    });

    // angular controller

    namespace.MainCtrl = function ($scope, $location, $logger) {
        $logger.log('angular is executing MainCtrl');

        if ($location.path().length === 0) {
            $location.path('/home');
        }
    };
    namespace.MainCtrl.$inject = ['$scope', '$location', '$logger'];

    namespace.HomeCtrl = function ($scope, $logger) {
        $logger.log('angular is executing HomeCtrl');
    };
    namespace.HomeCtrl.$inject = ['$scope', '$logger'];

    // angular app

    namespace.App = angular.module('project', ['project.service', 'project.directive'], 
        ['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

                $routeProvider.when('/home', {
                    template: homeTemplate,
                    controller: namespace.HomeCtrl
                });
            
            $locationProvider.html5Mode(false);
            $locationProvider.hashPrefix('!');
        }]
    );

    // bootstrap

    angular.element(document).ready(function() {
        angular.bootstrap(document, ['project']);
    });
});
