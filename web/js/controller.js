/**
 * Created by Bragg Troy on 2017/6/24.
 */
//app.controller('myCtrl', ['$scope',function ($scope) {
//
//}]);


// 首页
app.controller('homeCtrl', ['$scope','$http','$templateCache','$templateRequest', function ($scope,$http,$templateCache,$templateRequest) {
    $scope.ads = [
        {adname:'m1.jpg'},
        {adname:'m2.jpg'},
        {adname:'m3.jpg'}
    ];
    //模板
    var template = '';
    $.each($scope.ads,function(i,v){
        template += '<li><a href="#"><img _src="images/home/'+ v.adname +'" src="images/common/blank.png" /></a></li>';
    });
    $templateCache.put('ul_template',template)

    //当数据是$http获取时
    $http({
        method:'GET',
        url:'http://cdn.static.runoob.com/libs/angular.js/1.4.6/angular.min.js'
    }).then(
        function successCallback(response){}
    )


/*
* $http({
 method: 'GET',
 url: 'http://www.runoob.com/try/angularjs/data/sites.php'
 }).then(function successCallback(response) {
 $scope.names = response.data.sites;
 }, function errorCallback(response) {
 // 请求失败执行代码
 });
 */



}])

// 分类
app.controller('classifyCtrl', ['$scope',function ($scope) {
    //
}]);

// 消息
app.controller('messageCtrl', ['$scope',function ($scope) {
    //
}]);

// 我的
app.controller('mineCtrl', ['$scope',function ($scope) {
    //
}]);

// 发布
app.controller('publishCtrl', ['$scope',function ($scope) {
    //
}]);






