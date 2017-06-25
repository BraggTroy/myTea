/**
 * Created by Bragg Troy on 2017/6/24.
 */
app.controller('myCtrl', ['$scope',function ($scope) {

}]);


// 首页
app.controller('homeCtrl', ['$scope','$http','$timeout', function ($scope,$http,$timeout) {
    $scope.ads = [
        {adname:'m1.jpg'},
        {adname:'m2.jpg'},
        {adname:'m3.jpg'}
    ];

    app.directive('adFunction',function () {
        return {
            link: function (scope,element,attr) {
                if(scope.$last == true){
                    // console.log('ng-repeat执行完毕')
                    // scope.$eval( attr.adL )
                    // scope.$emit('to-parent')
                    TouchSlide({
                        slideCell:"#focus",
                        titCell:".hd ul", //开启自动分页 autoPage:true ，此时设置 titCell 为导航元素包裹层
                        mainCell:".bd ul",
                        effect:"left",
                        autoPlay:true,//自动播放
                        autoPage:true, //自动分页
                        switchLoad:"_src" //切换加载，真实图片路径为"_src"
                    });
                }
            }
        }
    })
    $scope.adFunction = function () {
        TouchSlide({
            slideCell:"#focus",
            titCell:".hd ul", //开启自动分页 autoPage:true ，此时设置 titCell 为导航元素包裹层
            mainCell:".bd ul",
            effect:"left",
            autoPlay:true,//自动播放
            autoPage:true, //自动分页
            switchLoad:"_src" //切换加载，真实图片路径为"_src"
        });
    }
    $scope.$on('to-parent',function () {
        TouchSlide({
            slideCell:"#focus",
            titCell:".hd ul", //开启自动分页 autoPage:true ，此时设置 titCell 为导航元素包裹层
            mainCell:".bd ul",
            effect:"left",
            autoPlay:true,//自动播放
            autoPage:true, //自动分页
            switchLoad:"_src" //切换加载，真实图片路径为"_src"
        });
    })



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






