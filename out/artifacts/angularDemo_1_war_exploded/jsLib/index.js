

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
arr.indexOf("INQUIRY");     //返回该元素在数组中的索引，如果不存在返回-1，可用于判断

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

//=========================
var obj = {name:'chen',age:'24',sex:'man',height:'170'};    //这样的定义方式，使得属性可以for-in遍历
for(item in obj){
    console.log(obj[item]);
}
delete obj.name;  //删除name属性；obj={age:'24',sex:'man',height:'170'}
obj.hasOwnProperty('name'); //false

//设置属性不可编辑，修改删除等操作失效，严格模式下报错，非严格模式下忽略操作 
var person = {}
Object.defineProperty(person,"name",{
    configurable: false,
    value: 'chen'
});

//JS中排序的实现
//冒泡排序。依次比较相邻的两个元素，如果后一个小于前一个，则交换，这样从头到尾一次，就将最大的放到了末尾
function bubbleSort(arr) {
    var len = arr.length;
    for (var i = 0; i < len - 1; i++) {
        for (var j = 0; j < len - 1 - i; j++) {
            if (arr[j] > arr[j+1]) {        // 相邻元素两两对比
                var temp = arr[j+1];        // 元素交换
                arr[j+1] = arr[j];
                arr[j] = temp;
            }
        }
    }
    return arr;
}
//选择排序。首先在未排序序列中找到最小（大）元素，存放到排序序列的起始位置
// 再从剩余未排序元素中继续寻找最小（大）元素，然后放到已排序序列的末尾。
// 重复第二步，直到所有元素均排序完毕。
function selectionSort(arr) {
    var len = arr.length;
    var minIndex, temp;
    for (var i = 0; i < len - 1; i++) {
        minIndex = i;
        for (var j = i + 1; j < len; j++) {
            if (arr[j] < arr[minIndex]) {     // 寻找最小的数
                minIndex = j;                 // 将最小数的索引保存
            }
        }
        temp = arr[i];
        arr[i] = arr[minIndex];
        arr[minIndex] = temp;
    }
    return arr;
}
// 插入排序。
// 插入排序也比较简单。就像打扑克一样，依次将拿到的元素插入到正确的位置即可。
// 将第一待排序序列第一个元素看做一个有序序列，把第二个元素到最后一个元素当成是未排序序列。
// 从头到尾依次扫描未排序序列，将扫描到的每个元素插入有序序列的适当位置。（如果待插入的元素与有序序列中的某个元素相等，则将待插入元素插入到相等元素的后面。）
function insertionSort(arr) {
    var len = arr.length;
    var preIndex, current;
    for (var i = 1; i < len; i++) {
        preIndex = i - 1;
        current = arr[i];
        while(preIndex >= 0 && arr[preIndex] > current) {
            arr[preIndex+1] = arr[preIndex];
            preIndex--;
        }
        arr[preIndex+1] = current;
    }
    return arr;
}

//最后，归并排序，也是效率最高的排序。基本原理是分治法，就是分开并且递归来排序。
// 申请空间，使其大小为两个已经排序序列之和，该空间用来存放合并后的序列；
// 设定两个指针，最初位置分别为两个已经排序序列的起始位置；
// 比较两个指针所指向的元素，选择相对小的元素放入到合并空间，并移动指针到下一位置；
// 重复步骤 3 直到某一指针达到序列尾；
// 将另一序列剩下的所有元素直接复制到合并序列尾。
function mergeSort(arr) {  // 采用自上而下的递归方法
    var len = arr.length;
    if(len < 2) {
        return arr;
    }
    var middle = Math.floor(len / 2),
        left = arr.slice(0, middle),
        right = arr.slice(middle);
    return merge(mergeSort(left), mergeSort(right));
}
function merge(left, right)      {
    var result = [];

    while (left.length && right.length) {
        if (left[0] <= right[0]) {
            result.push(left.shift());
        } else {
            result.push(right.shift());
        }
    }

    while (left.length)
        result.push(left.shift());

    while (right.length)
        result.push(right.shift());

    return result;
}

