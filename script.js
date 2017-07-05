// script.js

// create the module and name it scotchApp
// also include ngRoute for all our routing needs

var scotchApp = angular.module('scotchApp', ['ngRoute']);

scotchApp.factory('HttpExpectionInterceptor', ['$q', '$window', function ($q, $window) {
	return {
	    request: function(config){
	    	if(!config.url.endsWith(".html")) {
	    		config.url = "http://10.10.31.166:8080/api" + config.url;
	    		config.headers['Access-Control-Allow-Origin'] = '*';
	    	}
	    	console.log("==request:%o", config);
	    	return config;
	    },
	    requestError: function(err){
	    	//console.log("requestError:%o", err);
	    	return $q.reject(err);
	    },
	    response: function(res){
	   		//console.log("response:%o", res);
	      	return res;
	    },
	    responseError: function(err){
	    	if($window.parent && $window.parent.alertShow) {
	    		if(err.config.method == 'GET') {
	    			$window.parent.alertShow('error', '页面加载数据失败，请刷新页面或者联系维护人员。');
	    		} else if(err.config.method == 'PUT' || err.config.method == 'POST') {
	    			$window.parent.alertShow('error', '数据保存失败，请重新保存或者联系维护人员。');
	    		} else if(err.config.method == 'DELETE') {
	    			$window.parent.alertShow('error', '删除失败，请重新保存或者联系维护人员。');
	    		} else {
	    			$window.parent.alertShow('error', '操作失败，请重试或者联系维护人员。');
	    		}
	    	}

		    if(-1 === err.status) {

		    } else if(500 === err.status) {

		    } else if(501 === err.status) {
		        // ...
		    }
	      return $q.reject(err);
	    }
    };
}]);


// 添加对应的 Interceptors
scotchApp.config(['$httpProvider', function($httpProvider){
	$httpProvider.interceptors.push('HttpExpectionInterceptor');
	$httpProvider.defaults.withCredentials = false;  
    $httpProvider.defaults.headers.common = { 'Access-Control-Allow-Origin' : '*' }  
}]);

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

scotchApp.controller('loginController', function($rootScope, $scope, $location, $http) {
	console.log($location);
	$scope.message = 'Look! I am an login page. I want to ' + $location.search().originalPath;
	$scope.user = {};
	$scope.login = function () {

		$http.post('/login', $scope.user).then(function (response) {
			console.log(response);
		});

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
