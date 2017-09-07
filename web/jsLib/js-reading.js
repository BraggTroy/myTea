2016.12.27
============================================
1.<script>标签添加defer属性，则立即下载但是延迟执行	（2.1）//表示书本章节
	<script src="jquery.js" defer="defer"></script>
  <script>标签添加async属性，则页面不会等待脚本的加载和执行，异步执行其他脚本，所以最好不要有依赖和DOM操作
	async	英[a'zInk]
	<script src="jquery.js" async ></script>

2.Number类型（重要数据类型）	（3.4.5）
	var n1 = 10; var s1 = "k";
	isNaN(n1) => false; isNaN(s1) => true;
	typeof(n1) === "number" => true;

2017.01.05
============================================
1.Number类型
支持十进制、八进制、十六进制表示法。
var intNum = 55;	十进制
var octalNum = 070;	八进制--56	注：8进制数字序列（0~7），前导为“0”
var 0ctalNum = 08;	无效的八进制--8	注：超出范围则前导0被忽略，按十进制解析。
var hexNum = 0xA;	十六进制--10	注：16进制数字序列（0~9，a~f），前导为“0x”

在进行计算时，所有类型数值转换为10进制计算

    1.1 isNaN()新认识
	含义：能否被转换为数值，若能则返回false，若不能则返回true
	isNaN(10)=>false;	isNaN("10")=>false;
	isNaN("str")=>true;	isNaN(true)=>false;(可以转换为1)
    1.2 NaN != NaN 	NaN是一个特殊的数值，不等于任何值也不等于其本身
	isNaN(NaN)=>true;
    1.3 数据的强制转换常使用parseInt()和parseFloat()，很少使用Number()
	parseInt("0xaf",16) <==> parseInt("af",16);	//175  指定待解析值的数据类型

2.String类型
转换为字符串的两种方法：
toString()	str.toString();	对null与undefined无效
String()	String(str);	可将null=>“null”,undefined=>"undefined"

	注：若对象为number，则toString(para)可转为对应进制的数值字符串  
	如：var num = 10; num.toString(2)  =>  "1010"



2017.02.07
============================================
1.javascript中label语句用法：http://blog.163.com/hongshaoguoguo@126/blog/static/18046981201210485439329/
举一个比较典型的例子，看完后即明白 Label 的应用：（未添加 Label）
        var num = 0;
        for (var i = 0 ; i < 10 ; i++){
             for (var j = 0 ; j < 10 ; j++){
                  if( i == 5 && j == 5 ){
                        break;
                  }
             num++;
             }
        }
        alert(num); // 循环在 i 为5，j 为5的时候跳出 j循环，但会继续执行 i 循环，输出 95

对比使用了 Label 之后的程序：（添加 Label 后）
    var num = 0;
    outPoint:
    for (var i = 0 ; i < 10 ; i++){
         for (var j = 0 ; j < 10 ; j++){
              if( i == 5 && j == 5 ){
                    break outPoint;
              }
         num++;
         }
    }
    alert(num); // 循环在 i 为5，j 为5的时候跳出双循环，返回到outPoint层继续执行，输出 55




    <li><a href="http://www.yeahzan.com/fa/facss.html" target="main">图标调用</a></li>
    <li><a href="http://hemin.cn/jq/cheatsheet.html" target="main">Jquery手册</a></li>
    <li><a href="http://tool.c7sky.com/webcolor/" target="main">配色板</a></li>