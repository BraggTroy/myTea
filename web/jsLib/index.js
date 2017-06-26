

//map();返回被fn处理过的新数组。   map(index,elem)
//将val拼接
$("input").map(function(){
    return $(this).val()
}).get().join(",")


var arr = Array.of("b","a","c",undefined);

arr.shift();    //删除数组第一个元素,并返回被删除元素
arr.unshift("a");   //在数组前面添加一个元素“a”，并返回新数组长度

arr.pop();    //删除数组末位元素，并返回被删除元素
arr.push();     //在数组最后添加一个元素，并返回新数组长度

arr.slice(n,m);     //返回数组中从下标为n开始的m个元素，不影响原数组
arr.splice(n,m,p);  //删除数组中下标为n开始的m个元素，并在被删除位置插入p，返回被删除元素
arr.sort();     //数组元素自然排序，参数可选为函数
arr.reverse();  //倒置数组元素
arr.toString(); //等同于arr.join(",")
arr.join();     //将数组中元素拼接为字符串并返回，不影响原数组

var arr2 = arr.slice();     //将arr复制到arr2，arr变化不影响arr2
var arr3 = arr;     //arr的变化将直接指向arr3 (映射)

//=======================
// 类数组对象。   结构与数组类似，且提供length
var arrLike = {
    length: 3,
    0: "foo",
    1: "bar"
};
var arr = Array.prototype.slice.call( arrLike );
var arr = Array.from(arrLike);
// 以上两句效果一样，都返回["foo","bar",undefined]


$.inArray("INQUIRY",arr);   //返回该元素在数组中的索引，如果不存在返回-1，可用于判断


//===================================
Math.ceil();//向上取整
Math.floor();//向下取整
Math.round();//标准四舍五入
Math.floor(Math.random()*9+1);  //1-10之间整数
var selectFrom = function(lowCase, upCase){
    var chioce = upCase - lowCase + 1;
    return Math.floor(Math.random() * chioce + lowCase);
};//    在lowCase到upCase之间选择任意一个数
// 应用场景：在某数组中随机选取数组元素，如随机色彩













