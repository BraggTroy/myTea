/**
 * Created by Bragg Troy on 2017/6/30.
 */
$(function () {
    document.getElementById("container").style.height = document.documentElement.clientHeight + "px";

    function dialog_move() {
        var $move = $('.red');
        var $box = $('#bubble-box');

        //声明需要用到的变量
        var mx = 0,my = 0;      //鼠标x、y轴坐标（相对于left，top）
        var dx = 0,dy = 0;      //对话框坐标（同上）
        var box_x = 0,box_y = 0;    //球桌容器
        var isDraging = false;      //不可拖动

        //鼠标按下
        $move.mousedown(function(e){
            e = e || window.event;
            mx = e.pageX;     //点击时鼠标X坐标
            my = e.pageY;     //点击时鼠标Y坐标
            dx = $move.offset().left;
            dy = $move.offset().top;

            box_x = $box.offset().left;
            box_y = $box.offset().top;
            isDraging = true;      //标记对话框可拖动
        });

        //鼠标移动更新窗口位置
        $(document).mousemove(function(e){

            if(isDraging){        //判断对话框能否拖动
                var e = e || window.event;
                var x = e.pageX;      //移动时鼠标X坐标
                var y = e.pageY;      //移动时鼠标Y坐标

                var moveX = dx + x - mx;      //移动后对话框新的left值
                var moveY = dy + y - my;      //移动后对话框新的top值
                //设置拖动范围
                var pageW = $(document).width();
                var pageH = $(document).height();
                var dialogW = $move.width();
                var dialogH = $move.height();
                var maxX = pageW - dialogW - box_x;       //X轴可拖动最大值
                var maxY = pageH - dialogH - box_y;       //Y轴可拖动最大值
                moveX = Math.min(Math.max(box_x,moveX),maxX);     //X轴可拖动范围
                moveY = Math.min(Math.max(box_y,moveY),maxY);     //Y轴可拖动范围
                //重新设置对话框的left、top
                $move.css({"left":moveX + 'px',"top":moveY - $(window).scrollTop() + 'px'});
            };
        });
        //鼠标离开
        $move.mouseup(function(){
            isDraging = false;
        });

    }

    function redBubble() {
        this.width = width;
        this.height = height;


    }



    dialog_move();

})




