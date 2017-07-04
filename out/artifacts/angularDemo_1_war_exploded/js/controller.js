/**
 * Created by Bragg Troy on 2017/6/24.
 */
//app.controller('myCtrl', ['$scope',function ($scope) {
//
//}]);


// 首页
app.controller('homeCtrl', ['$scope','$http','$templateCache','$templateRequest', function ($scope,$http,$templateCache) {
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
    // $templateCache.put('ul_template',template);  //异步实现有延迟
    $("#bd-ul").html(template);
    TouchSlide({
        slideCell: "#focus",
        titCell: ".hd ul", //开启自动分页 autoPage:true ，此时设置 titCell 为导航元素包裹层
        mainCell: ".bd ul",
        effect: "left",
        autoPlay: true,//自动播放
        autoPage: true, //自动分页
        switchLoad: "_src" //切换加载，真实图片路径为"_src"
    });

    //当数据是$http获取时
    /*$http({
        method:'GET',
        datatype:'jsonp',
        url:'http://cdn.static.runoob.com/libs/angular.js/1.4.6/angular.min.js'
    }).then(
        function successCallback(response){}
    )*/

    //$.getJSON("https://way.jd.com/he/freeweather?city=shanghai&appkey=72f124730a2b503771ed4f16fc2b9167&callback=success_jsonpCallback", function(data) {
    //$.getJSON("http://www.runoob.com/try/ajax/jsonp.php?jsoncallback=?", function(data) {

    //});

    /*$.ajax({
        url:'https://way.jd.com/he/freeweather',
        type:'GET',                                //jsonp 类型下只能使用GET,不能用POST,这里不写默认为GET
        dataType:'jsonp',                          //指定为jsonp类型
        data:{city:'shanghai',appkey:'72f124730a2b503771ed4f16fc2b9167'},
        jsonp:'callback',                          //服务器端获取回调函数名的key，对应后台有$_GET['callback']='getName';callback是默认值
        jsonpCallback:'success_jsonpCallback',
        success:function(res){
            console.log(1)
        },
        error:function(res){
            console.log(0)
        }
    });*/


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


function weatherFunc(data){
    console.log(data)
}



