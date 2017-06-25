/**
 * Created by Bragg Troy on 2017/6/24.
 */


    var app = angular.module("myApp",["ngRoute"]);

    app.config(["$routeProvider",function ($routeProvider) {
        $routeProvider
            .when('/',{templateUrl:'view/home.html',controller:'homeCtrl'})
            .when('/classify',{templateUrl:'view/classify.html',controller:'classifyCtrl'})
            .when('/publish',{templateUrl:'view/publish.html',controller:'publishCtrl'})
            .when('/message',{templateUrl:'view/message.html',controller:'messageCtrl'})
            .when('/mine',{templateUrl:'view/mine.html',controller:'mineCtrl'})

            .otherwise({redirectTo:'/'});
    }]);







