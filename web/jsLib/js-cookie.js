一、添加新cookie并设置过期时间
function setCookie(NameOfCookie, value, expiredays) {
	var exdate = new Date()
	exdate.setDate(exdate.getDate() + expiredays)
	document.cookie = NameOfCookie + "=" + escape(value) + ((expiredays == null) ? "" : "; expires=" + exdate.toGMTString())
}

//setCookie("c_name", value, 365);


function getCookie(NameOfCookie) {
	if (document.cookie.length > 0) {
		c_start = document.cookie.indexOf(NameOfCookie + "=")
		if (c_start != -1) {
			c_start = c_start + NameOfCookie.length + 1
			c_end = document.cookie.indexOf(";", c_start)
			if (c_end == -1) c_end = document.cookie.length
			return unescape(document.cookie.substring(c_start, c_end))
		}
	}
	return 'a';
}

function checkCookie(c_name) {
	setCookie("c_name", c_name, 365);
	//此处多个setCookie则可以同时修改多个cookie
	
	//Cdate = getCookie("c_name");

}
checkCookie("1");





二、直接修改某个cookie值,但有所不同
document.cookie="userId=929";
	注：修改对应值将更新其value

	注2：Domain（域名）将会有所区别，有效期无法设置（默认session），path可能变为/disk（原：/）


jQuery中的操作
$.cookie()




http://www.w3school.com.cn/js/js_cookies.asp
http://www.php100.com/html/webkaifa/javascript/2012/0405/10197.html