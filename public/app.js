'use strict';

var MSJapan = angular.module('MSJapan', []);

function mainController($scope, $http) {
    $scope.data = {};

     // when landing on the page, get all brand and show them
    $http.get('/products')
        .success(function(data) {
            $scope.data = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
};

