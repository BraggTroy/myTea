ES.deploy = '${TRUCK_DEPLOY}'
ES.sso_truck={
    'login':'${SSO_LOGIN_URL}',
    'loginType':'${SSO_LOGIN_TYPE}',
    'timeout':'${SSO_TIME_OUT_URL}',
    'sso_logout':"${SSO_LOG_OUT_URL}",
    'info_logout':"${SSO_INFO_LOG_OUT_URL}"
}

ES.tpl.menu_tpl = [
    '<div class="menu-operation">{{menuOpt}} <i class="fa fa-outdent menu-retract"></i> </div>',
    '<div class="menu-operation-open">{{menuOptOpen}} <i class="fa fa-indent"></i> <div class="open-menu-info">{{menuOpen}}</div></div>',
    '{{#if menus}}<ul class="menus">',
    '	{{#each menus}}',
    '		{{#if parent}}',
    '			<li class="main-nav-left menu"><a href="' + ES.deploy + '{{url}}"><span>{{name}}</span> <span class="trangle"></span></a></li>',
    '		{{else}}',
    '			<li class="main-nav-left title" data-value="{{id}}"><i class="fa fa-file-text-o"></i><span> {{name}}</span></li>',
    '  		{{/if}}',
    '	{{/each}}',
    '</ul>{{/if}}'
].join('');

ES.menu_show = function (config) {
    var url = '/user/menu'
    ES.util.ajax_get(url, {}, function (res) {
        var findAllParents = function (list) {
            var ret = []
            var temp = []
            ES.each(list, function (_, menu) {
                if (menu.parent && temp.indexOf(menu.parent) < 0) {
                    temp.push(menu.parent)
                    ret.push({
                        name: menu.parent,
                        id: menu.parentId,
                        parent: null,
                        url: null
                    })
                }
            })
            return ret
        }

        Handlebars.registerHelper('username', function () {
            return ES.user.userName
        })
        var findAllChirden = function (parent, list) {
            var ret = []
            ES.each(list, function (index, menu) {
                if (menu.parent && menu.parent === parent) {
                    ret.push(menu)
                }
            })
            return ret
        }

        var sorted = []
        var list = res.menus
        var parents = findAllParents(list)
        ES.each(parents, function (i, parentmenu) {
            var children = findAllChirden(parentmenu.name, list)
            if (parentmenu.id === 'COUPON') {
                parentmenu.name = parentmenu.name + '(' + res.couponSize + ')'
            }

            sorted.push(parentmenu)
            sorted = sorted.concat(children)
        })

        var template = Handlebars.compile(ES.tpl.menu_tpl)

        ES.get('#personal-info-left').append(template({
            menuOpt: ES.msg.get('closeMenu'),
            menuOpen: ES.msg.get('openMenu'),
            menus: sorted,
            maintitle: ES.msg.my_sea
        }))
        ES.get('#personal-info-left .menu').on('click', function () {
            var href = $(this).find('a').attr('href')
            $(this).find('a').attr('href', href)
        })

        ES.get('.info-basic').hide()

        //当前页面菜单高亮
        ES.each(ES.get('#personal-info-left .menu'), function (_, item) {
            if (location.pathname.indexOf('booking-list.') >= 0 || location.pathname.indexOf('booking-list-seller') >= 0) {
                //$(item).addClass('active')
                ES.each(ES.get('#personal-info-left .menu'), function (i, inner_item) {
                    if (ES.get(inner_item).children().attr('href').indexOf('view-order') >= 0 || ES.get(inner_item).children().attr('href').indexOf('booking-list') >= 0 || ES.get(inner_item).children().attr('href').indexOf('booking-list-seller') >= 0) {
                        ES.get(inner_item).addClass('active')
                        return false
                    }
                })
                return false
            } else {
                var locationName = location.pathname;
                if (ES.lang == "en-us") {
                    locationName = location.pathname.replace("-en", "")
                }
                if (ES.get(item).children().attr('href').indexOf(locationName) >= 0) {
                    ES.get(item).addClass('active')
                }
            }
        })

        //菜單收放
        ES.get('#personal-info-left .title').on('click', function () {
            var toggleMenu = function (item) {
                if (item.next().hasClass('menu')) {
                    item.next().toggle()
                    toggleMenu(item.next())
                }
            }
            toggleMenu(ES.get(this))
        })

        ES.get('#personal-info-left .title').trigger('click')

        //左侧菜单
        var leftWidth = 137;
        var retractWidth = 30;
        if (ES.lang == "en-us") {
            retractWidth = 36;
        }
        ES.get('.menu-operation').click(function () {
            ES.get('.menu-operation-open').show()
            ES.get('.menu-operation').hide()
            ES.get('.menus').hide()
            ES.get('#personal-info-left').css({
                'width': retractWidth
            })
            var width = ES.get('#personal-info-right').width()
            ES.get('#personal-info-right').css({
                'width': leftWidth - retractWidth + width,
                'margin-left': retractWidth
            })
            ES.get(window).resize()
        })

        ES.get('.menu-operation-open').click(function () {
            ES.get('.menu-operation-open').hide()
            ES.get('.menu-operation').show()
            ES.get('.menus').show()
            ES.get('#personal-info-left').css({
                'width': leftWidth
            })
            var width = ES.get('#personal-info-right').width()
            ES.get('#personal-info-right').css({
                'width': width - (leftWidth - 30),
                'margin-left': leftWidth
            })
            ES.get(window).resize()
        })


        ES.util.truck_breadcrumb(config)
    })
}

ES.util.truck_breadcrumb = function (config) {
    ES.each(ES.get('#personal-info-left .title'), function (index, item) {
        ES.each(ES.consts.menu_default_open, function (i, v) {
            if($(item).data('value') == v){
                $(item).trigger('click')
                return true
            }
        })
    })

    //放开当前子菜单所在的一组菜单，同时返回父菜单名
    function openMenu() {
        var name = ''
        ES.each(ES.get('.menus .active').prevAll(), function (_, item) {
            if ($(item).hasClass('title')) {
                name = $(item).find('span').html()
                var memuvalidate = function (value) {
                    var result = true
                    ES.each(ES.consts.menu_default_open, function (i, v) {
                        if(value == v) {
                            result = false
                            return
                        }
                    })
                    return result
                }

                if(memuvalidate($(item).data('value'))) $(item).trigger('click')

                return false
            }
        })
        return name
    }

    var parentNode = openMenu()

    if(config && config.items){
        var template = Handlebars.compile(ES.get('#breadcrumb-detail-tpl').html())
        ES.get('.bread-crumbs').html(template(config))
    } else {
        var activeMenu = ES.get('.menus').find('.active')
        var childNode = activeMenu.find('a span:eq(0)').html()
        if(ES.get('#breadcrumb-tpl').html() != void 0){
            var template = Handlebars.compile(ES.get('#breadcrumb-tpl').html())
            ES.get('.bread-crumbs').html(template({
                "parent-node": parentNode,
                "child-node": childNode
            }))
        }
    }
}

ES.truck_show = function () {
    ES.get('#shell-header-language a').click(function () {
        ES.lang = ES.get(this).data('value')
        $.cookie('lang', ES.lang, {
            expires: 365,
            path: '/'
        })
        location.reload()
    })
    var tracking_input = ES.ui.input({
        el: 'trackingNo',
        placeholder: ES.msg.get('inputTracking'),
        cls: 'tracking-input',
        label: ES.msg.get('cargoTracking') + '',
        after_labels: ['<a id="search_tracking"></a>']
    })

    ES.mvx.add(tracking_input)

    var tracking_btn = ES.ui.button({
        el: 'search_tracking',
        cls: 'tracking-btn',
        text: '<i class="fa fa-search" aria-hidden="true"></i>',
        onclick: function () {
            ES.util.redirect('tracking.html?no=' + tracking_input.get_value())
        }
    })
    ES.mvx.add(tracking_btn)
    $('#login-head').click(function () {
        if (ES.user) {
            //ES.util.authority_redirect(ES.user.authorities)
            ES.util.redirect('truck-home.html')
        } else {
            ES.util.redirectLogin()
            // ES.util.redirect('login.html')
        }
    })

    $('#shell-wrap').css({
        visibility: 'visible'
    })
    $('#shell-nav-wrap').css({
        visibility: 'visible'
    })
    $('#shell-search').css({
        visibility: 'visible'
    })
    $('#shell-top-inner').css({
        visibility: 'visible'
    })
    if (ES.client_width <= 1300) {
        ES.get('.weixin-wrap').css({
            'right': '-100px'
        }).hover(function () {
            ES.get(this).animate({
                'right': '0'
            })
        }, function () {
            ES.get(this).animate({
                'right': '-100px'
            })
        })
    }
    ES.get('.weixin-wrap').show()

    ES.get('#to-top a').eq(1).click(function () {
        ES.util.scroll_to_top(0)
    })
    ES.get('#to-top a').eq(2).mouseover(function () {
        $('.app_code').show()
    }).mouseout(function () {
        $('.app_code').hide()
    })

    ES.get('#to-top').hover(function () {
        ES.get(this).stop().animate({
            right: 0
        })
    }, function () {
        ES.get(this).stop().animate({
            right: -45
        })
    })

    // resize window

    var init = function () {
        ES.get('.main-body').scroll(scroll)
        resize(20)
        ES.get(window).resize(function () {
            ES.client_height = document.documentElement.clientHeight
            ES.client_width = document.documentElement.clientWidth
            resize(0)
        })
    }
    var resize = function (offset) {
        var leftNav = ES.get('#personal-info-left')
        var mainBody = ES.get('#personal-info-right')
        var width = ES.client_width
        var height = ES.client_height - 69
        var padding = 15
        var widthLeft = leftNav.width()
        var widthBody = width - widthLeft - 2 * padding - offset
        if (width <= 1000) {
            widthLeft = widthLeft
            widthBody = 850
        }
        leftNav.css({
            'width': widthLeft,
            'height': height,
            'overflow-y': 'auto'
        })
        mainBody.css({
            'padding': '38px ' + padding + 'px ' + padding + 'px ' + padding + 'px',
            'width': widthBody
        })
        var footerHeight = ES.get('#shell-footer-copyright').outerHeight()
        var paddingTop = 38
        $('#personal-info-right').scroll().css({
            'min-height': height - footerHeight - paddingTop - padding - 1
        })
        ES.get('#shell-footer').show()
    }
    init()
}
ES.util.ajax = $.ajax

ES.util.ajax_get = function (url, param, callback, scope, arg, error) {
    url = ES.deploy + '/ws-truck' + url + '${EXT}'
    $.ajax({
        url: url,
        cache: false,
        context: scope,
        dataType: 'json',
        data: param,
        success: function (res) {
            if (res.message) {
                ES.ui.alert({
                    key: res.message,
                    type: 'error'
                })
                if (res.stackTrace) {
                    console.log(res.stackTrace);
                }

            } else {
                callback(res, arg)
            }
        },
        error: function (res) {
            if (res.status == 408) {
                ES.ui.alert({
                    title: ES.msg.get('tuochetong'),
                    key: 'network_error_key',
                    type: 'error'
                })
                return
            }
            var key = 'ajax_failed'
            if (res.responseJSON && res.responseJSON.message) {
                key = res.responseJSON.message
            } else if (res.responseJSON && $.isArray(res.responseJSON)) {
                var out = []
                ES.each(res.responseJSON, function (_, v) {
                    out.push(v.message)
                })
                key = out.join('<br>')
            }
            ES.ui.unmask()
            if (key == ES.consts.tips.LOGIN_FIRST ||
                key == ES.consts.tips.LOGIN_FIRST_EN) {
                if (ES.lang == "en-us") {
                    key = ES.msg.get("login_first")
                }
                ES.ui.alert({
                    title: ES.msg.get('tuochetong'),
                    key: key,
                    type: 'error',
                    after_callback: function () {
                        ES.util.forwardRedirectLogin();
                        //ES.util.forwardredirect('login.html')
                        // window.location.href = ES.sso_truck.login
                    }
                })
            } else {
                ES.ui.alert({
                    title: ES.msg.get('tuochetong'),
                    key: key,
                    type: 'error',
                    after_callback: function () {
                        if (error) {
                            error()
                        }
                    }
                })
            }
        }
    })
}
ES.util.ajax_post = function (url, param, callback) {
    url = ES.deploy + '/ws-truck' + url
    $.ajax({
        type: "POST",
        url: url,
        data: param,
        headers: {
            'X-Requested-By': 'eshipping'
        },
        success: function (res) {
            if (res.message) {
                ES.ui.alert({
                    title: ES.msg.get('tuochetong'),
                    key: res.message,
                    type: 'error'
                })
                if (res.stackTrace) {
                    console.log(res.stackTrace);
                }
            } else {
                callback(res)
            }
        },
        error: function (res) {
            if (res.status == 408) {
                ES.ui.alert({
                    title: ES.msg.get('tuochetong'),
                    key: 'network_error_key',
                    type: 'error'
                })
                return
            }
            var key = 'ajax_failed'
            if (res.responseJSON && res.responseJSON.message) {
                key = res.responseJSON.message
            } else if (res.responseJSON && $.isArray(res.responseJSON)) {
                var out = []
                ES.each(res.responseJSON, function (_, v) {
                    out.push(v.message)
                })
                key = out.join('<br>')
            }
            ES.ui.unmask()
            if (key == ES.consts.tips.LOGIN_FIRST ||
                key == ES.consts.tips.LOGIN_FIRST_EN) {
                ES.ui.alert({
                    title: ES.msg.get('tuochetong'),
                    key: key,
                    type: 'error',
                    after_callback: function () {
                        ES.util.forwardRedirectLogin()
                        //ES.util.forwardredirect('login.html')
                        // window.location.href = ES.sso_truck.login
                    }
                })
            } else {
                ES.ui.alert({
                    title: ES.msg.get('tuochetong'),
                    key: key,
                    type: 'error'
                })
            }
        }
    })
}
ES.util.ajax_submit = function (url, param, callback, error) {
    url = ES.deploy + '/ws-truck' + url
    $.ajax({
        type: 'POST',
        url: url,
        data: ES.stringify(param),
        cache: false,
        contentType: 'application/json; charset=UTF-8',
        processData: false,
        headers: {
            'X-Requested-By': 'eshipping'
        },
        success: function (res) {
            if (res.message) {
                ES.ui.alert({
                    title: ES.msg.get('tuochetong'),
                    key: res.message,
                    type: 'error'
                })
                if (res.stackTrace) {
                    console.log(res.stackTrace);
                }
            } else {
                callback(res)
            }
        },
        error: function (res) {
            if (res.status == 408) {
                ES.ui.alert({
                    title: ES.msg.get('tuochetong'),
                    key: 'network_error_key',
                    type: 'error'
                })
                return
            }
            var key = 'ajax_failed'
            if (res.responseJSON && res.responseJSON.message) {
                key = res.responseJSON.message
            } else if (res.responseJSON && $.isArray(res.responseJSON)) {
                var out = []
                ES.each(res.responseJSON, function (_, v) {
                    out.push(v.message)
                })
                key = out.join('<br>')
            }
            ES.ui.unmask()
            if (key == ES.consts.tips.LOGIN_FIRST ||
                key == ES.consts.tips.LOGIN_FIRST_EN) {
                ES.ui.alert({
                    title: ES.msg.get('tuochetong'),
                    key: key,
                    type: 'error',
                    after_callback: function () {
                        ES.util.forwardRedirectLogin()
                        // ES.util.forwardredirect('login.html')
                        // window.location.href = ES.sso_truck.login
                    }
                })
            } else {
                ES.ui.alert({
                    title: ES.msg.get('tuochetong'),
                    key: key,
                    type: 'error',
                    after_callback: function () {
                        if (error) {
                            error()
                        }
                    }
                })
            }

        }
    });
}
ES.util.cross_get = function (url, param, callback, scope) {
    $.ajax({
        url: url,
        cache: false,
        context: scope,
        jsonp: "callback",
        dataType: "jsonp",
        data: param,
        success: function (res) {
            if (res.message) {
                ES.ui.alert({
                    title: ES.msg.get('tuochetong'),
                    key: res.message,
                    type: 'error'
                })
                if (res.stackTrace) {
                    console.log(res.stackTrace);
                }
            } else {
                callback(res)
            }
        },
        error: function (res) {
            if (res.status == 408) {
                ES.ui.alert({
                    title: ES.msg.get('tuochetong'),
                    key: 'network_error_key',
                    type: 'error'
                })
                return
            }
            var key = 'ajax_failed'
            if (res.responseJSON && res.responseJSON.message) {
                key = res.responseJSON.message
            } else if (res.responseJSON && $.isArray(res.responseJSON)) {
                var out = []
                ES.each(res.responseJSON, function (_, v) {
                    out.push(v.message)
                })
                key = out.join('<br>')
            }
            ES.ui.unmask()
            if (key == ES.consts.tips.LOGIN_FIRST ||
                key == ES.consts.tips.LOGIN_FIRST_EN) {
                ES.ui.alert({
                    title: ES.msg.get('tuochetong'),
                    key: key,
                    type: 'error',
                    after_callback: function () {
                        ES.util.forwardredirect('login.html')
                    }
                })
            } else {
                ES.ui.alert({
                    title: ES.msg.get('tuochetong'),
                    key: key,
                    type: 'error'
                })
            }
        }
    })
}
ES.util.bind_data = function (data, url, param, el, value, isNull) {
    if (el && data.length == 0) {
        if (isNull) {
            data.push({
                value: '',
                display: ES.msg.get('all')
            })
        }
        ES.util.ajax_get(url, param || {}, function (res) {
            ES.get(res.datas).each(function (_, v) {
                data.push({
                    value: v.code,
                    display: v.name
                })
            })
            if (el) {
                el.bind_list(data)
            }
            if (value) {
                el.set_value(value)
            }
        })
    } else {
        if (el) {
            el.bind_list(data)
        }
        if (value) {
            el.set_value(value)
        }
    }

}


ES.util.advancedQuery = function($el, array) {
	if ($el.length < 0) {
		return []
	}
	var _array = [];
	return function() {
		$el.each(function(i) {
			_array[_array.length] = $(this).attr("name")
		})
		if (array) {
			_array = _array.concat(array);
		}
		return _array
	}()
}

ES.util.advancedQueryBtn = function(callback) {
	ES.ui.button({
		el: 'advancedQueryBtn',
		text: "",
		cls: 'btn',
		onclick: function() {
			if($("[advancedQuery]").parents(".input-wrap").css("display") != "none"){
				$("[advancedQuery]").attr("advancedQuery", false);
				$("[advancedQuery]").parents(".input-wrap").hide("fast");
                $(this).removeClass('active');
			}else{
				$("[advancedQuery]").attr("advancedQuery", true);
				$("[advancedQuery]").parents(".input-wrap").show("fast");
                $(this).addClass('active');
			}
			if(callback){
				callback()
			}
		}
	})
	$('#advancedQueryBtn').trigger('click')
}

// 基于 jquery-form 插件，用ajax提交form
// 上传文件时使用
// options {formId:'x', data: {}, beforeSubmit:function(){}, success: function(){}}
ES.util.ajax_submit_form = function(options) {
    var form,
        para

    para = {
        dataType: options.dataType || 'json',
        headers: {
            'X-Requested-By': 'eshipping'
        },
        beforeSubmit: function () {
            return options.beforeSubmit && options.beforeSubmit()
        },
        data: options.data || {},
        success: function (res) {
            options.success && options.success(res)
        },
        error: function (res) {
            if (res.status == 408) {
                ES.ui.alert({
                    key: 'network_error_key',
                    type: 'error'
                });
                return
            }
            var key = 'ajax_failed';
            if (res.responseJSON && res.responseJSON.message) {
                key = res.responseJSON.message
            } else if (res.responseJSON && $.isArray(res.responseJSON)) {
                var out = [];
                ES.each(res.responseJSON, function (_, v) {
                    out.push(v.message)
                });
                key = out.join('<br>')
            }
            ES.ui.unmask();
            if (key == ES.consts.tips.LOGIN_FIRST ||
                key == ES.consts.tips.LOGIN_FIRST_EN) {
                ES.ui.alert({
                    key: key,
                    type: 'error',
                    after_callback: function () {
                        ES.util.forwardredirect('../login.html')
                    }
                })
            } else {
                ES.ui.alert({
                    key: key,
                    type: 'error',
                    after_callback: function () {
                        options.error && options.error()
                    }
                })
            }
        }
    }

    form = $('#' + options.formId)
    if(form.length === 0) {
        return
    }

    form.ajaxSubmit && form.ajaxSubmit(para)
}
ES.util.date_to_string = function (d, format, hasTime) {
    if (!format) {
        if(hasTime){
            format = '{{y}}-{{m}}-{{d}} {{hour}}:{{min}}:{{sec}}'
        } else {
            format = '{{y}}-{{m}}-{{d}}'
        }
    }
    var curr_date = d.getDate();
    if (curr_date < 10) {
        curr_date = '0' + curr_date
    }
    var curr_month = d.getMonth() + 1; //Months are zero based
    if (curr_month < 10) {
        curr_month = '0' + curr_month
    }
    var curr_year = d.getFullYear();

    var curr_hour = d.getHours()
    if (curr_hour < 10) {
        curr_hour = '0' + curr_hour
    }
    var curr_Minutes = d.getMinutes()
    if (curr_Minutes < 10) {
        curr_Minutes = '0' + curr_Minutes
    }
    //var curr_seconds = d.getSeconds()
    //if (curr_seconds < 10) {
    //    curr_seconds = '0' + curr_seconds
    //}

    if(hasTime){
        return ES.util.format_string(format, {
            y: curr_year,
            m: curr_month,
            d: curr_date,
            hour: curr_hour,
            min: curr_Minutes,
            sec: '00'
        })
    } else {
        return ES.util.format_string(format, {
            y: curr_year,
            m: curr_month,
            d: curr_date
        })
    }

}

ES.util.checkItems = function (config){
    this.items = [];
    this.itemsTrParent = config ? config.itemsTrParent : $('.box-list tbody');
    this.itemsAllLength = function(){
        return this.itemsTrParent.find('tr').length
    };
    this.itemsAllBtn = $('.sticky-thead .js-container-checkbox');

    this.time = null;
    this.itemsAll = function () {
        var _array = []
        for (var i = 0; this.itemsAllLength() > i; i++) {
            _array.push(i);
        }
        return _array
    };
    this.listenerCheckBox = function (index, type) {
        if (type == "single") {
            this.items = ((this.items.indexOf(index) > -1) && (this.items.length == 1)) ? [] : [index];
        } else if (type === "none") {
            this.items = [];
        } else if (type === "all") {
            this.items = this.itemsAll();
        } else if (this.items.indexOf(index) > -1) {
            this.items.splice(this.items.indexOf(index), 1)
        } else {
            this.items.push(index)
        }

        if (this.items.length >= this.itemsAllLength()) {
            this.itemsAllBtn.prop('checked', true)
        } else {
            this.itemsAllBtn.prop('checked', false)
        }

        this.itemsTrParent.find('tr input').prop("checked", false)
        this.itemsTrParent.find('tr').removeClass('active')
        for (var i = 0; i < this.items.length; i++) {
            this.itemsTrParent.find('tr:eq(' + this.items[i] + ') input').prop("checked", true);
            this.itemsTrParent.find('tr:eq(' + this.items[i] + ')').addClass('active')
        }
        return this.items
    };
    return this;
}

ES.util.priceFormat = function (obj){
    return (parseFloat(obj || 0) * 100).toFixed(0) / 100;
}
