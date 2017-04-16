// script.js

// create the module and name it scotchApp
// also include ngRoute for all our routing needs

var scotchApp = angular.module('scotchApp', ['ngRoute']);
// create the controller and inject Angular's $scope
scotchApp.controller('mainController', function($scope) {
	// create a message to display in our view
	$scope.message = 'Everyone come and see how good I look!';
});

scotchApp.controller('aboutController', function($scope) {
	$scope.message = 'Look! I am an about page.';
});

scotchApp.controller('contactController', function($scope) {
	$scope.message = 'Contact us! JK. This is just a demo.';
});

scotchApp.controller('loginController', function($rootScope, $scope, $location) {
	console.log($location);
	$scope.message = 'Look! I am an login page. I want to ' + $location.search().originalPath;
	$scope.user = {};
	$scope.login = function () {
		$rootScope.user = $scope.user;
		// $('#loginModal').modal('toggle');
		$location.path($location.search().originalPath);
	};

});

// scotchApp.constant('USER_ROLES', {
//   all: '*',
//   admin: 'admin',
//   editor: 'editor',
//   guest: 'guest'
// });

scotchApp.controller('appController', function($rootScope, $scope, $location) {

     $rootScope.$on('$routeChangeStart', function (event, next, current) {
     	console.log('$routeChangeStart:event[%o], next[%o], current[%o]', event, next, current);
     	var authorizedRoles = next.authorizedRoles;
     	console.log('$routeChangeStart:authorizedRoles[%o]', authorizedRoles);
     	if(authorizedRoles) {
     		if($rootScope.user == null || $rootScope.user == {}) {
     			$location.search({originalPath: $location.path()});
     			$location.path("/login");
     		} else if(authorizedRoles[0] != $rootScope.user.role) {
     			$location.path("/login");
     		}
     	}
	 });
	 $rootScope.$on('$routeChangeSuccess', function (event, next, previous) {
     	console.log('$routeChangeSuccess:event[%o], next[%o], previous[%o]', event, next, previous);
     	
	 });
 });

scotchApp.controller('preController', function($rootScope, $scope, $route, $routeParams, $location) {
     $scope.$route = $route;
     $scope.$location = $location;
     $scope.$routeParams = $routeParams;
 });

//邮件
var messages=[{
    id:0,
    sender:"王经理",
    subject:"项目总结",
    date:"2015-4-2 09:00:4",
    recipient:"小李",
    message:"记得明天上午开会要收项目总结，不要搞砸了。"
},{
    id:1,
    sender:"小姨子",
    subject:"明天吃饭",
    date:"2015-4-2 23:12:56",
    recipient:"小李",
    message:"姐夫明天请我吃饭啦。"
}];

scotchApp.controller('emailList', ['$scope', function($scope){
    $scope.emails=messages;
}]);

scotchApp.controller('emailDetail',['$scope','$routeParams',function($scope,$routeParams){
    $scope.email=messages[$routeParams.id];
}]);

// configure our routes
scotchApp.config(function($routeProvider, $locationProvider) {
	$routeProvider.when('/', {
			templateUrl : 'pages/home.html',
			controller  : 'mainController'
		})

		// route for the about page
		.when('/about', {
			templateUrl : 'pages/about.html',
			controller  : 'aboutController'
		})

		// route for the contact page
		.when('/contact', {
			templateUrl : 'pages/contact.html',
			controller  : 'contactController'
		})

		.when('/emails', {
			controller:'emailList',
			templateUrl:'./pages/emailList.html',
			authorizedRoles: ['admin', 'editor']
	    })
	    .when('/emails/:id',{
	        controller:'emailDetail',
	        templateUrl:'./pages/emailDetail.html',
	        authorizedRoles: ['admin', 'editor']
	    })
	    .when('/login',{
	        controller:'loginController',
	        templateUrl:'./pages/login.html'
	    })
	    .otherwise({
        	redirectTo: '/'
    	});
	// $locationProvider.html5Mode(true);
});
