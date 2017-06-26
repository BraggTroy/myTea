ES.ui.paging = function(config) {
	var pageSize = $.cookie('pageSize')
	var setCookie = !pageSize ? false : true
	if (!pageSize) {
		pageSize = 25
	}
	ES.pageSize = pageSize
	var es_paging = function (conf) {
		conf = conf || {}
		if (!conf.el) {
			return
		}
		var id = "#" + conf.el
		var el = $(id)

		this.el = el
		this.el.addClass('paging')
		this.id = conf.el
		this.show_per_page = conf.perPage || true

		this.refresh = function (total_page, page, total_count) {
			this.current = page
			var paging = $('#' + this.id)
			var from = page - 2
			var end = page + 2
			if (from <= 0) {
				from = 1
				end = from + 4
			}
			if (end > total_page) {
				end = total_page
				from = total_page - 4
			}
			if (from <= 0) {
				from = 1
			}
			if (total_count <= 0) {
				paging.empty()
				return
			}

			var itemTpl = '<a class="paging-item" href="javascript:void(0)" title="{{title}}" data-value="{{value}}" data-parent="{{parent}}">{{display}}</a>'
			paging.empty()
			var inner = []
			inner.push('<span class="paging-info"> ' + ES.msg.get('paging_size', {
					arg0: page,
					arg1: total_page
				}) + '&nbsp;&nbsp;' + ES.msg.get('paging_recordnum', {arg0: total_count}) + '</span>')
			if (page > 1) {
				inner.push(ES.util.format_string(itemTpl, {
					display: '<span><i class="fa fa-backward"></i></span>',
					value: 1,
					title: 'Page ' + (1),
					parent: this.id
				}))
				inner.push(ES.util.format_string(itemTpl, {
					display: '<span><i class="fa fa-caret-left"></i></span>',
					value: page - 1,
					title: 'Page ' + (page - 1),
					parent: this.id
				}))
			} else { 
				inner.push(ES.util.format_string(itemTpl, {
					display: '<span class="paging-disabled"><i class="fa fa-backward"></i></span>',
					value: -1,
					title: '',
					parent: this.id
				}))
				inner.push(ES.util.format_string(itemTpl, {
					display: '<span class="paging-disabled"><i class="fa fa-caret-left"></i></span>',
					value: -1,
					title: '',
					parent: this.id
				}))
			}
			for (var i = from - 1; i < end; i++) {
				var item = '<span>' + (i + 1) + '</span>'
				if (i + 1 === page) {
					item = '<span class="paging-current">' + (i + 1) + '</span>'
				}
				inner.push(ES.util.format_string(itemTpl, {
					display: item,
					value: i + 1,
					title: 'Page ' + (i + 1),
					parent: this.id
				}))
			}
			if (page < end) {
				inner.push(ES.util.format_string(itemTpl, {
					display: '<span><i class="fa fa-caret-right"></i></span>',
					value: page + 1,
					title: 'Page ' + (page + 1),
					parent: this.id
				}))
				inner.push(ES.util.format_string(itemTpl, {
					display: '<span><i class="fa fa-forward"></i></span>',
					value: total_page,
					title: 'Page ' + (total_page),
					parent: this.id
				}))
			} else {
				inner.push(ES.util.format_string(itemTpl, {
					display: '<span class="paging-disabled"><i class="fa fa-caret-right"></i></span>',
					value: -1,
					title: '',
					parent: this.id
				}))
				inner.push(ES.util.format_string(itemTpl, {
					display: '<span class="paging-disabled"><i class="fa fa-forward"></i></span>',
					value: -1,
					title: '',
					parent: this.id
				}))
			}
			if (this.show_per_page) {

				var select_item = ['<select id="paging-size-select">',
					'<option value="25">25</option>',
					'<option value="50">50</option>',
					'<option value="100">100</option>',
					'</select>'].join('')

				inner.push('&nbsp;<span class="paging-info"> ' + ES.msg.get('per_page') + '：' + select_item)
			}
			paging.html(inner.join(''));
			$('#' + this.id + ' .paging-item').click(function () {
				var page = $(this).data('value')
				var id = $(this).data('parent')
				if (page > 0) {
					ES.event.fire(id, 'change', page)
				}
			})
			if (this.show_per_page) {
				var $page_size_select = $('#paging-size-select')
				$page_size_select.val(ES.pageSize == void 0 ? '25' : ES.pageSize)
				$page_size_select.change(ES.delegate(function (e) {
					var pageSize = ES.get('#paging-size-select').val()
					ES.pageSize = pageSize
					$.cookie('pageSize', ES.pageSize, {
						expires: 365,
						path: '/'
					})
					ES.event.fire(this.id, 'change', 1)
				}, this))
			}
		}
		this.current = 1
	}
	var ret = new es_paging(config)
	ES.ui.add(ret.id, ret)
	return ret
}

ES.ui.vesselVoyage_map = function(el, res, mapType) {
	var script = document.createElement("script");
	script.type = "text/javascript";
	script.src = "http://api.map.baidu.com/api?v=2.0&ak=GOEGRcwYZBAXOlU7a0bwf9DV&callback=trackingCallback";
	document.body.appendChild(script);
	var data=res.movements;

	window.trackingCallback = function() {
		var map = new BMap.Map(el);
		if(mapType != 'current_position'){
			map.addControl(new BMap.ScaleControl({
				anchor: BMAP_ANCHOR_TOP_LEFT
			}))
			map.addControl(new BMap.NavigationControl());
			map.addControl(new BMap.NavigationControl({
				anchor: BMAP_ANCHOR_TOP_RIGHT,
				type: BMAP_NAVIGATION_CONTROL_SMALL
			}))
			map.addControl(new BMap.MapTypeControl({
				anchor: BMAP_ANCHOR_BOTTOM_RIGHT
			}));
		}

		var pointList = []
		for (var i = 0; i < data.length; i++) {
			var point = new BMap.Point(data[i].shipLongitude, data[i].shipLatitude)
			pointList.push(point)
		}
		var fromPoint = new BMap.Point(data[0].shipLongitude, data[0].shipLatitude)

		var myIcon = new BMap.Icon("/common/img/startingPoint.png", new BMap.Size(30,50));
		var fromMarker = new BMap.Marker(fromPoint,{icon:myIcon,offset:new BMap.Size(0, -30) });
		map.addOverlay(fromMarker);

		var currentPoint = new BMap.Point(data[data.length-1].shipLongitude, data[data.length-1].shipLatitude)
		var vectorFCArrow = new BMap.Marker(new BMap.Point(currentPoint.lng-0.01,currentPoint.lat), {
			// 初始化方向向上的闭合箭头
			icon: new BMap.Symbol(BMap_Symbol_SHAPE_FORWARD_CLOSED_ARROW, {
				scale: 1.5,
				strokeWeight: 1,
				rotation: data[data.length-1].vesselHead,//顺时针旋转30度
				fillColor: 'red',
				fillOpacity: 0.8
			})
		});
		map.addOverlay(vectorFCArrow);

		var middlePoint = pointList[Math.floor(data.length / 2)];
		map.centerAndZoom(middlePoint, 5);
		map.enableScrollWheelZoom();
		var polyline = new BMap.Polyline(pointList);
		map.addOverlay(polyline);
		window.trackingCallback = null
		delete window.trackingCallback
	}
}
ES.ui.alert = function(config,isHyperlink) {
	config = config || {}
	config = ES.util.merge({
		title: ES.msg.get('yihaitongxing'),
		auto_hide: true
	}, config)
	var key = config.key
	var arg = config.arg
	var msg = ES.msg.get(key, arg)
	var cls = ''
	var auto_hide = config.auto_hide
	if (config.type == 'error') {
		cls = 'class="error"'
		auto_hide = false
	}
	if(isHyperlink){
		var message  = '<p ' + cls + '><a href="'+ES.deploy+config.hyperlink+'">' + msg + '</a></p>'
	} else {
		var message  = '<p ' + cls + '>' + msg + '</p>'
	}

	ES.ui.popup({
        after_close: config.after_close,
		after_callback: config.after_callback,
		callback: config.callback,
		title: config.title,
		auto_hide: auto_hide,
		innerHTML:message
	})
}
ES.ui.map = function(el, res, currentMap) {
	var create_map_function = function(map,data){
    	var currentPoint = new BMap.Point(data.currentLongitude, data.currentLatitude)
    	if(data.centerPoint){
    		map.centerAndZoom(currentPoint, 10);
    	}
        var icon = data.icon || 'map-icon.png'
        var vectorFCArrow = new BMap.Marker(currentPoint,{icon:new BMap.Icon('${TRUCK_DOMAIN}/img/'+icon,new BMap.Size(23,35))})
        if(data.animate){
        	vectorFCArrow.setAnimation(BMAP_ANIMATION_BOUNCE);
        }
        map.addOverlay(vectorFCArrow);
        if(data.happenLocation){
			var label = new BMap.Label(data.happenLocation,{offset:new BMap.Size(-15,-30)});
			label.setStyle({
				color : "#fff",
				fontSize : "12px",
				backgroundColor :"#45351B",
				border :"0",
				'border-radius' :"3px",
				padding: '5px 10px'
			});
			vectorFCArrow.setLabel(label);
        }
    }
	var search_location_callback = function(map,searchResult){
		var poi;
		if(searchResult && searchResult.getPoi(0)){
			poi = searchResult.getPoi(0);
			create_map_function(map,{
				currentLongitude: poi.point.lng,
				currentLatitude: poi.point.lat,
				happenLocation: "地址："+searchResult.keyword,
				icon: 'map-icon2.png'
			})
		}
		if(res.mapType=='area'){
			var points = []
			if(poi && poi.point){
				points.push({
					lng: poi.point.lng,
					lat: poi.point.lat
				})
			}
			ES.each(res.list,function(_,v){
	    		if(v.longitude&&v.latitude){
					create_map_function(map,{
						currentLongitude: v.longitude,
						currentLatitude: v.latitude,
						happenLocation: v.statusName,
						type: 'point'
					})
					points.push({
						lng: v.longitude,
						lat: v.latitude
					})
	    		}
	    	})
			var centerBefore = map.getBounds().getCenter()
			var longitude = 0
			var latitude = 0
			var centerPoint = null
			if(points.length>0){
				ES.each(points,function(_,v){
					longitude += +v.lng
					latitude += +v.lat
				})
				centerPoint = new BMap.Point(longitude/points.length, latitude/points.length)
			}
			if(centerBefore){
				var bounds_lng = centerPoint.lng+centerBefore.lng
				var bounds_lat = centerPoint.lat+centerBefore.lat
				centerPoint = new BMap.Point(bounds_lng/2, bounds_lat/2)
				map.centerAndZoom(centerPoint, 5);
	    	}else{
	    		var point = '中国'
	    		map.centerAndZoom(centerPoint || point, 5);
	    	}
		}else if(res.mapType=='point'){
			if(res.longitude && res.latitude){
				create_map_function(map,{
					currentLongitude: res.longitude,
					currentLatitude: res.latitude,
					happenLocation: res.statusName,
					type: 'point',
					animate: true,
					centerPoint: true
				})
			}else if(searchResult && poi){
				map.centerAndZoom(poi.point, 10);
			}else{
				var point = '中国'
	    		map.centerAndZoom(point, 4);
			}
		}
	}
	var process_map_fun = function(){
		var map = currentMap || new BMap.Map(el);
		map.clearOverlays();
		if(el!=''){
			map.addControl(new BMap.ScaleControl({
	            anchor: BMAP_ANCHOR_TOP_LEFT
	        }))
	        map.addControl(new BMap.NavigationControl());
	        map.addControl(new BMap.NavigationControl({
	            anchor: BMAP_ANCHOR_TOP_RIGHT,
	            type: BMAP_NAVIGATION_CONTROL_SMALL
	        }))
	        map.addControl(new BMap.MapTypeControl({
	            anchor: BMAP_ANCHOR_BOTTOM_RIGHT
	        }));
		}
		if(res.area && res.area.length>0){
			var localSearch = new BMap.LocalSearch(map);
			localSearch.enableAutoViewport(); //允许自动调节窗体大小
			//先暂时解决centerAndZoom后SearchCompleteCallback调用两次的bug
			var i = -1
			var index = 0
			localSearch.setSearchCompleteCallback(function(searchResult) {
				if(i<0){
					if((index+1)==res.area.length || (searchResult && searchResult.getPoi(0))){
						search_location_callback(map,searchResult)
						i++
					}else{
						index++
						if(res.area[index]){
							i = -1
							localSearch.search(res.area[index]);
						}
					}
				}
		　　	});
		　　  localSearch.search(res.area[index]);
		}else{
			search_location_callback(map)
		}
	}
	if(currentMap){
		process_map_fun()
	}else if(res){
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "http://api.map.baidu.com/api?v=2.0&ak=GOEGRcwYZBAXOlU7a0bwf9DV&callback=truckCallback";
        document.body.appendChild(script);
        window.truckCallback = function() {
            process_map_fun()
            window.truckCallback = null
            delete window.truckCallback
        }
    }else{
        ES.get('#'+el).html('<div class="no_tracking_info">'+ES.msg.get("no_tracking_info")+'</div>')
    }
}

ES.ui.deportMap = function (el,res,currentMap) {
	var initMap = function () {
		var map = new BMap.Map(el);
		ES.deportMap = map;
		ES.overlay = [];
		ES.markers = [];
		var point = new BMap.Point(121.487899,31.249162);
		map.centerAndZoom(point, 9);
		map.enableScrollWheelZoom();
		//添加控件
		var top_right_navigation = new BMap.NavigationControl({anchor: BMAP_ANCHOR_TOP_RIGHT, type: BMAP_NAVIGATION_CONTROL_SMALL}); //右上角
		map.addControl(top_right_navigation);
		//地图加载完触发事件
		map.addEventListener("tilesloaded",function(){
		});

	}
	var methodMap = function () {
		this.searchAddress = function (config,callback) {
			var geocoder = new BMap.Geocoder(),
				self = this,
				adds = config.adds,
				addressName= config.addressName;
			//删除遮盖层
			if(ES.overlay){
				for(var i= 0;i < ES.overlay.length;i++){
					ES.deportMap.removeOverlay(ES.overlay[i])
				}
			}
			//删除聚合点
			if(ES.MarkerClusterers){
				ES.each(ES.MarkerClusterers,function (_,v) {
					v.clusterer.removeMarkers(v.markers);
				})
			}
			geocoder.getPoint(addressName, function(point){
				if (point && ES.deportMap) {
					ES.locationData = [];
					for(var i= 0;i < ES.markers.length;i++){
						ES.deportMap.removeOverlay(ES.markers[i])
					}
					ES.deportMap.centerAndZoom(point, 9);
					var myIcon =new BMap.Icon("../truck-saas/img/marker_red_sprite.png",new BMap.Size(39, 25));
					var marker=new BMap.Marker(point,{icon:myIcon});
					ES.deportMap.addOverlay(marker);
					ES.markers.push(marker)
					// var opts = {
					// 	width : 200,     // 信息窗口宽度
					// 	height: 100,     // 信息窗口高度
					// 	title : "装箱点"
					// }
					// var infoWindow = new BMap.InfoWindow(addressName, opts);
					// ES.deportMap.openInfoWindow(infoWindow,point);
					// self.setRange(point)
					if(adds.length <= 0){
						var res = {"count":0}
						callback(res)
					}else{
						self.batchGetLocation(adds,point,callback);
					}
				}
			})
		}

		this.batchGetLocation = function (addressNames,location,callback) {
			var geocoder = new BMap.Geocoder(),
				self = this,
				addcunt = addressNames.length;
			var geoSearch = function (addressName,location,isCallback) {
				geocoder.getPoint(addressName, function(point){
					if (point && ES.deportMap) {
						var isShow = true;
						var distance =  (ES.deportMap.getDistance(location,point)).toFixed(2);
						if(distance > 300000){
							isShow = false
						}
						var data = {};
						data.point = point;
						data.isShow = isShow;
						ES.locationData.push(data);
						ES.bdGEO()
						if(isCallback && callback){
							var markerList = [],
								res = {},
								count = 0,
								truckIds = [];
							ES.each(addressNames,function (_,v) {
								var marker = {},
									locationData = [],
									pointData = ES.locationData[_].point
								if(ES.locationData[_].isShow){
									for(var i=0;i < v.driverCount;i++){
										var location = {};
										location.longitude = pointData.lng
										location.latitude = pointData.lat
										locationData.push(location)
									}
									marker.name = v.name;
									marker.data = locationData
									markerList.push(marker)
									count += v.driverCount;
									truckIds = $.unique(truckIds.concat(v.truckIds))
								}
							});
							res.count = count;
							res.truckIds = truckIds;
							self.setMarkerClusterer(markerList);
							callback(res);
						}
					}
				})
			}
			var index = 0;
			ES.bdGEO = function (){
				if(index > addcunt-1){
					return;
				}
				var isCallback = false;
				if(index == addcunt-1){
					isCallback = true;
				}
				var v = addressNames[index];
				geoSearch(v.name,location,isCallback)
				index++;
			};
			ES.bdGEO();
		}

		this.setMarkerClusterer = function (markerList) {
			ES.MarkerClusterers = [];
			var marker = markerList || []
			var markers = [];
			ES.each(marker,function (_,v) {
				var pt = null;
				for(var i=0;i<v.data.length;i++){
					pt = new BMap.Point(v.data[i].longitude,v.data[i].latitude);
					markers.push(new BMap.Marker(pt));
				}
			})
			var data = {};
			var clusterer = new BMapLib.MarkerClusterer(ES.deportMap, {markers:markers});
			ES.each(clusterer.getMarkers(),function (_,v) {
				var myIcon =new BMap.Icon("../truck-saas/img/truck.png",new BMap.Size(64, 64));
				v.setIcon(myIcon);
			})
			data.markers = markers;
			data.clusterer = clusterer;
			var styles = [];
			var styleData = clusterer.getStyles()[0]
			if(clusterer.getStyles().length > 0){
				// styleData.url = "../truck-saas/img/clusterer.png";
				// styleData.size.width = 48
				// styleData.size.height = 47
				// styles.push(styleData);
				// clusterer.setStyles(styles);
			}
			ES.MarkerClusterers.push(data);
		}
		this.setRange = function (point) {
			//添加范围
			//centre:椭圆中心点,X:横向经度,Y:纵向纬度
			var add_oval = function(centre,x,y)
			{
				var assemble=[];
				var angle;
				var dot;
				var tangent=x/y;
				for(i=0;i<36;i++)
				{
					angle = (2* Math.PI / 36) * i;
					dot = new BMap.Point(centre.lng+Math.sin(angle)*y*tangent, centre.lat+Math.cos(angle)*y);
					assemble.push(dot);
				}
				return assemble;
			}
			var oval = new BMap.Polygon(add_oval(point,2,1.2), {strokeColor:"#9B9DA5", strokeWeight:2, strokeOpacity:0.6,fillColor:"#388FFC"});
			if(ES.deportMap){
				overlay = ES.deportMap.addOverlay(oval);
				ES.overlay.push(oval)
			}
		}
	}
	if(currentMap){
		initMap()
	}else if(res){
		var script = document.createElement("script");
		script.type = "text/javascript";
		script.src = "http://api.map.baidu.com/api?v=2.0&ak=GOEGRcwYZBAXOlU7a0bwf9DV&callback=truckCallback";
		document.head.appendChild(script);
		window.truckCallback = function() {
			var clusterer = document.createElement("script");
			clusterer.type = "text/javascript";
			clusterer.src = "http://api.map.baidu.com/library/MarkerClusterer/1.2/src/MarkerClusterer_min.js";
			document.head.appendChild(clusterer);
			var overlay = document.createElement("script");
			overlay.type = "text/javascript";
			overlay.src = "http://api.map.baidu.com/library/TextIconOverlay/1.2/src/TextIconOverlay_min.js";
			document.head.appendChild(overlay);
			initMap();
			window.truckCallback = null
			delete window.truckCallback
		}
	}else{
		ES.get('#'+el).html('<div class="no_tracking_info">'+ES.msg.get("no_tracking_info")+'</div>')
	}
	var ret = new methodMap();
	return ret;
}


ES.ui.getRoadDistance = function (source,destination,callback) {
	window.initialize = function (){
		var map = new google.maps.DistanceMatrixService();
		var request = {
			origins: [source],
			destinations: [destination],
			travelMode: google.maps.TravelMode.DRIVING,
			unitSystem: google.maps.UnitSystem.METRIC,
			avoidHighways: false,
			avoidTolls: false
		};
		map.getDistanceMatrix(request, function (response, status) {
			if (status == google.maps.DistanceMatrixStatus.OK && response.rows[0].elements[0].status != "ZERO_RESULTS" &&  response.rows[0].elements[0].status != "NOT_FOUND") {
				var data = {};
				data.distance = response.rows[0].elements[0].distance.value;
				data.duration = response.rows[0].elements[0].duration.value;
				callback(data);
			}else{
				var data = {};
				data.error = ES.msg.get("not_query_to_the_information")
				callback(data);
			}
		});
	}
	if(ES.get("#googleApi").length > 0){
		window.initialize();
		return false
	}
	var script =document.createElement("script");
	script.type = "text/javascript";
	script.src = "http://maps.googleapis.com/maps/api/js?key=AIzaSyBg9k0ePx3cUAskKJcGmJ9JSkcX2LYz2RU&callback=initialize";
	script.setAttribute("id","googleApi");
	document.body.appendChild(script);
}
	
ES.ui.geo_selector = function(config) {
	var ret = ES.ui.input(config)
	ret.el.attr('readonly', true)
	var lenList = 0,
		isLoad = false;
	if(!config.isEdit){
		config.countryId = 49
		if (ES.lang == 'en-us') {
			config.countryId = 212
		}
	}

	var displayList = [
		{"id":config.countryId},
		{"id":config.provinceId},
		{"id":config.cityId},
		{"id":config.regionId},
		{"id":config.subRegionId}
	]
	var selectId = 0;
	ES.get("#"+ret.id+"-drop").remove();
	var geo_div = $('<div class="input-drop input-geo-drop" data-value="' + ret.id + '" id="' + ret.id + '-drop"></div>')
	$('body').append(geo_div)
	var dom = {
		el: ret.id + '-drop',
		tabs: [{
			value: '',
			display: ES.msg.get('country') + '',
			cls: ''
		}, {
			value: '',
			display: ES.msg.get('common_province') + '',
			cls: ''
		}, {
			value: '',
			display: ES.msg.get('province') + '',
			cls: ''
		}, {
			value: '',
			display: ES.msg.get('city') + '',
			cls: ''
		}, {
			value: '',
			display: ES.msg.get('region') + '',
			cls: ''
		}, {
			value: '',
			display: ES.msg.get('subRegion') + '',
			cls: ''
		}],
		panels: [{}, {}, {}, {}, {},{}]
	}
	if(config.length){
		dom.tabs = dom.tabs.slice(0, config.length)
		dom.panels = dom.panels.slice(0, config.length)
	}
	var displayValue = [];
	lenList = ES.ui.tab_v(dom).len;
	var show_geo = function() {
		var geo = $(this)
		var width = config.width||geo.outerWidth()
		var height = geo.outerHeight()
		var offset = geo.offset()
		var tab_panel = ES.ui.get(geo.attr('id') + '-drop')
		tab_panel.el.css({
			top: offset.top + height,
			left: offset.left,
			width: width
		})
		tab_panel.el.show()
	}
	var filter_geo = function(tab_panel, level, val,selectedId,selectIndex, geoDefault, callback) {
		var query = '/geo/query'
		if (level <= 0) {
			query = '/geo/query_all_country'
			level = 0;
		}
		if(isLoad){
			tab_panel.set_panel(1)
		}else{
			tab_panel.set_panel(level)
		}

		ES.util.ajax_get(query, {
			parent: val
		}, function(res) {
			var out = ['<dl>']
			var common = []
			var compare = function (c1, c2) {
				var n1 = c1.nameEN;
				var n2 = c2.nameEN;
				if (n1 < n2) {
					return -1;
				} else if (n1 > n2) {
					return 1;
				} else {
					return 0;
				}
			}
			isLoad = ES.get("#"+ret.id+"-drop").css("display").indexOf("none") >= 0;
			res.children = res.children.sort(compare);
			var groupArr = [{
				'group': 'ABCDEFG',
				'groupObj': 'A-G'
			},{
				'group': 'HIJK',
				'groupObj': 'H-K'
			},{
				'group': 'LMNOPQRS',
				'groupObj': 'L-S'
			},{
				'group': 'TUVWXYZ',
				'groupObj': 'T-Z'
			}
			]
			var provinceArr = geoDefault ||ES.consts.china_province
			if (config.countryId == 212) {
				provinceArr = geoDefault || ES.consts.indonesia_province
			}
			var split = function (classify,groupObj) {
				var html = '<dt class="clear">' + groupObj + '</dt><dd>',
					index = 0;
				ES.each(res.children, function(_, v) {
					if (classify.indexOf(v.nameEN.substr(0,1).toUpperCase()) >= 0) {
						if (selectedId && v.id == selectedId) {
							html += '<span data-value="' + v.id + '" class="selected">' + v.name + '</span>';
							displayValue[selectIndex] = v.name;
						} else{
							html += '<span data-value="' + v.id + '">' + v.name + '</span>';
						}
						index++;
					}
				})
				html += '</dd>';
				if(index > 0){
					out.push(html);
				}
			}
			ES.each(provinceArr,function(_,item){
				common.push('<span data-value="' + item.id + '">' + item.name + '</span>')
			})
			ES.each(groupArr,function (_,item) {
				split(item.group,item.groupObj)
			})
			out.push('</dl>')
			if(level == 1){
				tab_panel.set_panel_dom(level + 1, out.join(''))
				tab_panel.set_panel_dom(level, common.join(''))
			} else {
				tab_panel.set_panel_dom(level, out.join(''))
			}
			var value = ES.get("#"+ret.id).val().trim()
			// if(selectedId){
			// 	ES.get("#"+ret.id).val(displayValue.join('-')).data('value', selectId)
			// }
			ret.el.trigger('change')
			var id = '#' + tab_panel.id + ' .panel';

			ES.get('#' + tab_panel.id + ' .panel').eq(level).unbind().bind('click', function(e) {
				var span
				if(e.target.nodeName.toLowerCase() == 'span'){
					span = $(e.target)
				}else{
					return
				}
				var dataValue = span.data('value')
				var lev = span.closest('.panel').index()
				var spanArr1 = span.parents(id).parent().children(id).eq(1).find('span')
				var spanArr2 = span.parents(id).parent().children(id).eq(2).find('span')
				span.parents(id).find('span').removeClass('selected')
				//省份的select同步
				if (lev == 1 || lev == 2){
					var spanSelect = function(spanArrI){
						ES.each(spanArrI,function(i,item){
							if (ES.get(item).data('value') == dataValue){
								ES.get(item).parents(id).find('span').removeClass('selected')
								ES.get(item).addClass('selected')
							}
						})
					}
					spanSelect(spanArr1)
					spanSelect(spanArr2)
					if (spanArr1.parent().find('.selected').data('value') != spanArr2.parent().find('.selected').data('value')) {
						spanArr1.parent().find('.selected').removeClass('selected')
					}
				} else{
					span.addClass('selected')
				}
				var drop = span.closest('.input-geo-drop')
				var len = ES.get("#"+ret.id+"-drop .tab-v-panels div.panel").length;
				//var index = $(this).parents(id).index()+1;

				var get_selected_string = function(drop) {
					var list = drop.find('.selected')
					var res = []
					ES.each(list, function(_, v) {
						var items = ES.get(list[_]).html();
						if($.inArray(items,res) == -1) {
							res.push($(v).html())
						}
					})
					return res.join(' - ')
				}
				if (lev <= 1) {
					lev += 2
				} else {
					lev = (+lev) + 1
				}
				for (var i = lev; i<len ;i++){
					ES.get("#"+ret.id+"-drop .tab-v-panels div.panel").eq(i).html("");
				}
				ES.get('#' + drop.data('value')).val(get_selected_string(drop)).data('value', dataValue)
				if (lev >= lenList) {
					ret.el.trigger('change')
					drop.hide()
					if(config.callback) config.callback()
					return
				}
				var tab_panel = ES.ui.get(drop.attr('id'))
				filter_geo(tab_panel, lev, dataValue, null, null, geoDefault)
			})
			ES.get('#' + tab_panel.id + ' .tab').eq(0).hide()

			callback && callback()
		})
	}
	ES.get('#' + ret.id).unbind().on('click', function(e) {
		//geo BUG临时方案
		if(ES.get(".input-geo-drop .tab-v-panels").length>0){
			ES.get(".input-geo-drop .tab-v-panels").find(".panel").eq(5).html("")
			ES.get(".input-geo-drop .tab-v-panels").find(".panel").eq(4).html("")
			ES.get(".input-geo-drop .tab-v-panels").find(".panel").eq(3).html("")
		}
		isLoad = ES.get("#"+ret.id+"-drop").css("display").indexOf("none") >= 0;
		if (ES.get(this).hasClass('disabled')) {
			e.preventDefault()
			return false
		}
		show_geo.apply(this)
		var el = ES.ui.get($(this).attr('id') + '-drop')
		displayValue = [];
		var isDefault = true;


		var countOne = 0,
			countTwo = 0
		var addSelectedStyle = function(value) {
			var panels = el.el.find('.panel')
			ES.each(panels, function(i, panel) {
				if(ES.get(panel).is(':visible')) {
					var spans = ES.get(panel).find('span')
					ES.each(spans, function(j, span) {
						if(value == ES.get(span).data('value')) {
							ES.get(span).addClass('selected')
						}
					})
				}
			})
		}
		var callback = function() {
			countTwo++
			if(countTwo == countOne) {
				addSelectedStyle(4367)
				filter_geo(el, 3, 4367, null, null, undefined, function() {
					addSelectedStyle(4724)
					filter_geo(el, 4, 4724, null, null, undefined)
				})
			}
		}
		ES.each(displayList,function(_,v){
			var q = null;
			if(_ > 0){
				q = displayList[_-1].id
			}
			if(v.id && v.id != ""){
				countOne++
				filter_geo(el,_,q,v.id,_, config.geoDefault)
				filter_geo(el,_+1,v.id,_,null, config.geoDefault, callback)
				if (_ == 0){
					countOne++
					filter_geo(el,_+2,v.id,_,null, config.geoDefault, callback)
				}
				selectId = v.id
				isDefault = false;
			}
		})
		if(isDefault){
			countOne++
			filter_geo(el, 0, null, null, null, config.geoDefault, callback)
		}
		e.preventDefault()
		return false
	})
	ret.etype = 'geo_selector'
	ret.get_value = function() {
		return +this.el.data('value')
	}
	ret.get_display_value = function() {
		return this.el.val()
	}
	ret.set_value = function(v) {
		return this.el.data('value', v)
	}
	ret.set_display_value = function(v) {
		this.el.val(v)
		if(this.el.hasClass('change-input')) this.el.trigger('change')
		return this.el
	}
	ret.clear_value = function() {
		return this.el.val('').data('value', '')
	}

	ES.ui.add(ret.id, ret)
	return ret
}

ES.ui.mask = function(config) {
	config = config || {}
	if (!config.multi && $('.shadow').length > 0) {
		return
	}
	//var mask = '<div class="shadow"><i class="fa fa-refresh fa-spin"></i></div>'
	var mask = '<div class="shadow"><div class="mask"><div class="spin"></div></div></div>'
	if (!config.ele) {
		mask = $(mask)
		mask.css({
			'line-height': $('body').height() + 'px'
		})
		$('body').append(mask)
	} else if (config.only) {
		var ele = $(config.ele)
		var top = ele.offset().top
		var height = ele.height()
		var mask1 = $(mask)
		var mask2 = $(mask)
		mask1.css({
			'position': 'absolute',
			'top': '0px',
			'height': top + 'px'
		});
		mask2.css({
			'position': 'absolute',
			'top': (top + height) + 'px',
			'height': ($('body').height() - top - height) + 'px'
		});
		ele.append(mask1).append(mask2)
	} else {
		var ele = $(config.ele)
		mask = $(mask)
		var left = 0
		var top = 0;
		if(config.isSetTop){
			left = ele.offset().left
			top = ele.offset().top
		}
		var width = ele.innerWidth()
		var height = ele.innerHeight()
		mask.css({
			'position': 'absolute',
			'top': top,
			'left':  left,
			'width': width + 'px',
			'height': height + 'px',
			'line-height': height + 'px'
		})
		ele.append(mask)
	}
}

/**
 * 为form表单添加enter事件
 * @param  {String} formId 表单的id
 * @param  {String} submitBtnId 查询按钮的id
 */
ES.ui.add_enter_event = function(formId, submitBtnId) {
	$(document).off('keydown', '#' + formId)
	$(document).on('keydown', '#' + formId, function(e) {
		var target,
			keyCode

		e = e || window.event || arguments.callee.caller.arguments[0]
		target = e.target || e.srcElement
		keyCode = e.keyCode || e.which

		if(keyCode !== 13) {
			return
		}

		// TODO 添加额外的判断条件
		if('select' === target.tagName.toLowerCase()) {
			return
		}

		$('#' + submitBtnId).trigger('click')
	})
}

ES.ui.input_multiselect = function(config) {
	var ret = ES.ui.input(config)
	ret.param = config.param ? config.param : {}
	ret.get_value = function() {
		return this.el.data('value') ? this.el.data('value') : ''
	}
	ret.get_display_value = function() {
		return this.el.val()
	}
	ret.set_display_value = function(val) {
		return this.el.val(val)
	}
	ret.set_value = function(val) {
		var g = this
		var find_geo_callback = function(res) {
			if (res.roleItems.length <= 0) {
				return
			}
			res = res.roleItems[0]
			if (ES.lang == 'en-us') {
				g.el.val(res.name)
			} else {
				g.el.val(res.name)
			}
		}
		ES.util.ajax_get('/geo/find_port_by_code', {
			code: val
		}, find_geo_callback)
		return this.el.data('value', val)
	}
	ret.clear_value = function() {
		return this.el.val('').data('value', '')
	}
	ret.set_preference = function(list) {
		this.preference = list
	}
	var table = $('<div class="input-drop input-port-drop" data-value="' + ret.id + '" id="' + ret.id + '-drop"></div>')
	$('body').append(table)
	var type = config.type
	var related = config.related
	var module = config.module
	var both = config.module == 'both'
	var isLoadDate = false
	var filter_geo = function(value) {
		var input = $(this)
		var inputValue = input.val()
		var drop = $('#' + input.attr('id') + '-drop')
		if (!inputValue) {
			inputValue = ''
		}

		var ws = ''

		if(config.dataUrl){
			ws=config.dataUrl;
		}
		var port = ''
		if (related && ES.ui.get(related)) {
			port = ES.ui.get(related).get_value()
		}
		var width = input.outerWidth() - 22
		width = width <= 200 ? 200 : width
		var height = input.outerHeight()
		var offset = input.offset()
		var poupFlag = input.closest('.popup').length>0?true:false
		var infactTop = offset.top + height
		if(poupFlag){
			infactTop = infactTop-$(document).scrollTop()
		}
		drop.css({
			top: infactTop,
			left: offset.left,
			'min-width': width,
			'position':poupFlag ? 'fixed' : 'absolute'
		})
		var reqData = ES.util.merge({
			q: inputValue,
			port: port,
			type: module
		}, ret.param)
		if(config.countryId){
			reqData.country = config.countryId;
		}
		if(isLoadDate){
			isLoadDate = false
			ES.util.ajax_get(ws,reqData , function(res) {
				ES.port = res;
			})
			return
		}
		drop.empty().html('<div class="input-port-item" data-value="-1">' + ES.msg.get('loading') + '</div>').show()
		var show_port = function (res) {
			var out = []
			var selected = false
			var preference = ES.ui.get(input.attr('id')).preference
			if(preference) {
				out.push('<div class="input-port-sep" data-value="-1">' + ES.msg.get('preference') + '</div>')
				ES.each(preference,function(_,v){
					if (ES.lang == 'en-us') {
						out.push('<div class="input-port-item " data-value="' + v.id + '" data-type="' + v.type + '">' +
							'<span style="float:right">' + v.id + '</span><span class="port-name"></div>')
					} else {
						out.push('<div class="input-port-item " data-value="' + v.id + '" data-type="' + v.type + '">' +
							'<span style="float:right">' + v.id + '</span><span class="port-name">' + v.name + '</span> </div>')
					}
				})
			}
			if (!res.roleItems || res.roleItems.length <= 0) {

				out.push('<div class="input-port-item" data-value="-1">' + ES.msg.get('default_empty_result') + '</div>')
				input.data('value', '')
			} else {
				var filter = {}
				var ports = res.roleItems
				ES.each(ports, function(_, v) {
					filter[v.name] = v
				})
				var t_p = []
				for (var p in filter) {
					if(filter.hasOwnProperty(p)){
						t_p.push(filter[p])
					}
				}

				var value = input.val().toLocaleUpperCase();

				ES.each(t_p, function(_, v) {

					if (ES.lang == 'zh-cn') {
						console.log(v)
						var name = v.name.toLocaleUpperCase()
						if (!(name.indexOf(value) >= 0)) {
							return true
						}
					}
					var cls = ''
					v.type = v.type ? v.type : ''
					if (input.val() == v.name  || input.val() == v.id) {
						cls = 'input-port-item-selected'
						input.data('value', v.id).data('type', v.type)
						selected = true
					}
					var companyName = ''
					if(v.companyName){
						companyName = '-' + v.companyName
					}
					if (ES.lang == 'en-us') {

						out.push('<div class="input-port-item ' + cls + '" data-value="' + v.id + '" data-type="' + v.type + '">' +
							'<span class="port-name">' + v.name + '</span>' + companyName + '</div>')
					} else {
						out.push('<div class="input-port-item ' + cls + '" data-value="' + v.id + '" data-type="' + v.type + '">' +
							'<span class="port-name">' + v.name + '</span>' + companyName + '</div>')
					}
				})
			}
			if(out.length > 10){
				out = out.splice(0,10);
			}else if(out.length <= 0){
				out.push('<div class="input-port-item" data-value="-1">' + ES.msg.get('default_empty_result') + '</div>')
				input.data('value', '')
			}
			drop.empty().html(out.join('')).show()
			if (!selected) {
				drop.children('div.input-port-item').eq(0).addClass('input-port-item-selected')
				if(inputValue) {
					input.data('value', drop.children('div.input-port-item').eq(0).data().value).data('type', drop.children('div.input-port-item').eq(0).data().type)
				}
			}
			drop.children('div.input-port-item').on('click', function(e) {
				var v = $(this)
				var tar = $('#' + v.parent().data().value).val(v.children('.port-name').html())
				if (v.data().value <= 0) {
					tar.val('').data('value', '').data('type', '')
					v.parent().hide()
					e.preventDefault()
					return false
				}
				tar.data('value', v.data().value).data('type', v.data().type).trigger('change',[value])
				ES.event.fire(v.parent().data().value, 'change', v.data().value)
				v.parent().hide()
				e.preventDefault()
			})
		}
		var res;

		ES.util.ajax_get(ws,reqData , function(res) {
			show_port(res);
		})

	}
	var intveral = null
	var inp = null
	var input_callback = function() {
        if(!inp)
            return
		var t_inp = $(inp)
		t_inp.data('value', t_inp.val())
		filter_geo.apply(inp)
	}
	if(window.attachEvent && document.getElementById(ret.id).onpropertychange){
		document.getElementById(ret.id).onpropertychange=function(){
			if(inp){
				ES.get('#' + ret.id).data().value = ''
				if (intveral != null) {
					clearTimeout(intveral)
					intveral = null
				}
				intveral = setTimeout(input_callback, 300)
			}
		}
	}else{
		ES.get('#' + ret.id).on('input',function(){
			if(inp){
				ES.get('#' + ret.id).data().value = ''
				if (intveral != null) {
					clearTimeout(intveral)
					intveral = null
				}
				intveral = setTimeout(input_callback, 300)
			}
		})
	}
	if(ES.lang == "zh-cn"){
		isLoadDate = true
		filter_geo.apply(ret.el)
	}
	ES.get('#' + ret.id).on('keydown', function(evt) {
		inp = null
		var drop = $('#' + $(this).attr('id') + '-drop')
		var children = drop.children('div.input-port-item')
		if (evt.which == 13) {
            // enter
			drop.children('div.input-port-item-selected').eq(0).trigger('click')
			evt.preventDefault()
		} else if (evt.which == 9) {
            // tab
            if($(this).val()) {
                drop.children('div.input-port-item-selected').eq(0).trigger('click')
            } else {
                drop.hide()
            }
            // tab can not preventDefault since we need browser to do other things
		} else if (evt.which == 38) {
            // arrow top
			var total = children.length
			for (var i = 0; i < total; i++) {
				if (i > 0 && children.eq(i).hasClass('input-port-item-selected')) {
					children.eq(i).removeClass('input-port-item-selected')
					children.eq(i - 1).addClass('input-port-item-selected')
					break;
				}
			}
			evt.preventDefault()
		} else if (evt.which == 40) {
            // arrow down
			var total = children.length
			for (var i = 0; i < total; i++) {
				if (i < total - 1 && children.eq(i).hasClass('input-port-item-selected')) {
					children.eq(i).removeClass('input-port-item-selected')
					children.eq(i + 1).addClass('input-port-item-selected')
					break;
				}
			}
			evt.preventDefault()
		} else {
			if ((evt.which < 48 && evt.which > 9) ||
				(evt.which > 105 && evt.which < 112) ||
				(evt.which > 123 && evt.which < 223)) {
				evt.preventDefault()
				return
			}
			inp = this
		}
	}).on('click', function(e) {
		var c = ES.get('#' + ES.get(this).attr('id') + '-drop')
		$(document).trigger('click')
		if (!c.is(":visible")) {
			$(document).trigger('click')
			var c = ES.get(this)
			var v = c.data('value')
			c.data('value', '')
			filter_geo.apply(this, [v])
			c.data('value', v)
			c.show()
		}
		e.preventDefault()
		return false
	})
	ret.etype = 'input_port'
	ES.ui.add(ret.id, ret)
	return ret
}

ES.ui.input_multi_select = function(config) {
	var ret = ES.ui.input(config)
	ES.save_data = null
	ret.param = config.param ? config.param : {}
	ret.get_value = function() {
		return this.el.data('value') ? this.el.data('value') : ''
	}
	ret.get_display_value = function() {
		return this.el.val()
	}
	ret.set_display_value = function(val) {
		return this.el.val(val)
	}
	ret.set_value = function(val) {
		var g = this
		var find_geo_callback = function(res) {
			if (res[config.res_dto].length <= 0) {
				return
			}
			res = res[config.res_dto][0]
			if (ES.lang == 'en-us') {
				g.el.val(res[config_display])
			} else {
				g.el.val(res[config_display])
			}
		}
		ES.util.ajax_get(config.dataUrl, {
			code: val
		}, find_geo_callback)
		return this.el.data('value', val)
	}
	ret.clear_value = function() {
		return this.el.val('').data('value', '')
	}
	ret.set_preference = function(list) {
		this.preference = list
	}
	var table = $('<div class="input-drop input-port-drop" data-value="' + ret.id + '" id="' + ret.id + '-drop"></div>')
	$('body').append(table)
	var type = config.type
	var related = config.related
	var module = config.module
	var both = config.module == 'both'
	var isLoadDate = true
	var filter_geo = function(value) {
		var input = $(this)
		var inputValue = input.val()
		var drop = $('#' + input.attr('id') + '-drop')
		if (!inputValue) {
			inputValue = ''
		}

		var ws = ''

		if(config.dataUrl){
			ws=config.dataUrl;
		}
		var port = ''
		if (related && ES.ui.get(related)) {
			port = ES.ui.get(related).get_value()
		}
		var width = input.outerWidth() - 22
		width = width <= 200 ? 200 : width
		var height = input.outerHeight()
		var offset = input.offset()
		var poupFlag = input.closest('.popup').length>0?true:false
		var infactTop = offset.top + height
		if(poupFlag){
			infactTop = infactTop-$(document).scrollTop()
		}
		drop.css({
			top: infactTop,
			left: offset.left,
			'min-width': width,
			'position':poupFlag ? 'fixed' : 'absolute'
		})
		var reqData = ES.util.merge({
			q: inputValue,
			port: port,
			type: module
		}, ret.param)
		if(config.countryId){
			reqData.country = config.countryId;
		}

		if(isLoadDate){
			isLoadDate = false
			ES.util.ajax_get(ws,reqData , function(res) {
				ES.save_data = res;
			})
			return
		}

		drop.empty().html('<div class="input-port-item" data-value="-1">' + ES.msg.get('loading') + '</div>').show()
		var show_port = function (res) {
			var out = []
			var selected = false
			var preference = ES.ui.get(input.attr('id')).preference
			if(preference) {
				out.push('<div class="input-port-sep" data-value="-1">' + ES.msg.get('preference') + '</div>')
				ES.each(preference,function(_,v){
					if (ES.lang == 'en-us') {
						out.push('<div class="input-port-item " data-value="' + v[config.value_dto] +'"><span class="port-name"></div>')
					} else {
						out.push('<div class="input-port-item " data-value="' + v[config.value_dto] +'"><span class="port-name">' + v[config.display_dto] + '</span></div>')
					}
				})
			}
			if (!res[config.res_dto] || res[config.res_dto].length <= 0) {
				out.push('<div class="input-port-item" data-value="-1">' + ES.msg.get('default_empty_result') + '</div>')
				input.data('value', '')
			} else {
				var filter = {}
				var ports = res[config.res_dto]
				ES.each(ports, function(_, v) {
					filter[v.name] = v
				})
				var t_p = []
				for (var p in filter) {
					if(filter.hasOwnProperty(p)){
						t_p.push(filter[p])
					}
				}

				var value = input.val().toLocaleUpperCase();

				ES.each(t_p, function(_, v) {

					if (ES.lang == 'zh-cn') {
						var name = v.name.toLocaleUpperCase()
						if (!(name.indexOf(value) >= 0)) {
							return true
						}
					}
					var cls = ''
					v.type = v.type ? v.type : ''
					if (input.val() == v[config.display_dto] || input.val() == v[config.value_dto]) {
						cls = 'input-port-item-selected'
						input.data('value', v.id).data('type', v.type)
						selected = true
					}
					var companyName = ''
					if(v.companyName){
						companyName = '-' + v.companyName
					}
					if (ES.lang == 'en-us') {

						out.push('<div class="input-port-item ' + cls + '" data-value="' + v[config.value_dto]  + '" data-type="' + v.type + '">' +
							'<span class="port-name">' + v[config.display_dto]+ '</span>' + companyName + '</div>')
					} else {
						out.push('<div class="input-port-item ' + cls + '" data-value="' + v[config.value_dto]  + '" data-type="' + v.type + '">' +
							'<span class="port-name">' + v[config.display_dto] + '</span>' + companyName + '</div>')
					}
				})
			}
			if(out.length > 10){
				out = out.splice(0,10);
			}else if(out.length <= 0){
				out.push('<div class="input-port-item" data-value="-1">' + ES.msg.get('default_empty_result') + '</div>')
				input.data('value', '')
			}
			drop.empty().html(out.join('')).show()
			if (!selected) {
				drop.children('div.input-port-item').eq(0).addClass('input-port-item-selected')
				if(inputValue) {
					input.data('value', drop.children('div.input-port-item').eq(0).data().value).data('type', drop.children('div.input-port-item').eq(0).data().type)
				}
			}
			drop.children('div.input-port-item').on('click', function(e) {
				var v = $(this)
				var tar = $('#' + v.parent().data().value).val(v.children('.port-name').html())
				if (v.data().value <= 0) {
					tar.val('').data('value', '').data('type', '')
					v.parent().hide()
					e.preventDefault()
					return false
				}
				tar.data('value', v.data().value).data('type', v.data().type).trigger('change',[value])
				ES.event.fire(v.parent().data().value, 'change', v.data().value)
				v.parent().hide()
				e.preventDefault()
			})
		}


		if(config.once){
			if(ES.save_data == null){
				ES.util.ajax_get(ws,reqData , function(res) {
					ES.save_data = res
				})
				return
			}else{
				show_port(ES.save_data);
			}
		}else{
			ES.util.ajax_get(ws,reqData , function(res) {
				ES.save_data = res
				show_port(res);
			})
		}
	}
	var intveral = null
	var inp = null
	var input_callback = function() {
        if(!inp)
            return
		var t_inp = $(inp)
		t_inp.data('value', t_inp.val())
		filter_geo.apply(inp)
	}
	if(window.attachEvent && document.getElementById(ret.id).onpropertychange){
		document.getElementById(ret.id).onpropertychange=function(){
			if(inp){
				ES.get('#' + ret.id).data().value = ''
				if (intveral != null) {
					clearTimeout(intveral)
					intveral = null
				}
				intveral = setTimeout(input_callback, 300)
			}
		}
	}else{
		ES.get('#' + ret.id).on('input',function(){
			if(inp){
				ES.get('#' + ret.id).data().value = ''
				if (intveral != null) {
					clearTimeout(intveral)
					intveral = null
				}
				intveral = setTimeout(input_callback, 300)
			}
		})
	}
	// if(ES.lang == "zh-cn"){
		filter_geo.apply(ret.el)
	// }
	ES.get('#' + ret.id).on('keydown', function(evt) {
		inp = null
		var drop = $('#' + $(this).attr('id') + '-drop')
		var children = drop.children('div.input-port-item')
		if (evt.which == 13) {
			drop.children('div.input-port-item-selected').eq(0).trigger('click')
			evt.preventDefault()
		} else if (evt.which == 9) {
            if($(this).val()) {
                drop.children('div.input-port-item-selected').eq(0).trigger('click')
            } else {
                drop.hide()
            }
		} else if (evt.which == 38) {
			var total = children.length
			for (var i = 0; i < total; i++) {
				if (i > 0 && children.eq(i).hasClass('input-port-item-selected')) {
					children.eq(i).removeClass('input-port-item-selected')
					children.eq(i - 1).addClass('input-port-item-selected')
					break;
				}
			}
			evt.preventDefault()
		} else if (evt.which == 40) {
			var total = children.length
			for (var i = 0; i < total; i++) {
				if (i < total - 1 && children.eq(i).hasClass('input-port-item-selected')) {
					children.eq(i).removeClass('input-port-item-selected')
					children.eq(i + 1).addClass('input-port-item-selected')
					break;
				}
			}
			evt.preventDefault()
		} else {
			if ((evt.which < 48 && evt.which > 9) ||
				(evt.which > 105 && evt.which < 112) ||
				(evt.which > 123 && evt.which < 223)) {
				evt.preventDefault()
				return
			}
			inp = this
		}
	}).on('click', function(e) {
		var c = ES.get('#' + ES.get(this).attr('id') + '-drop')
		$(document).trigger('click')
		if (!c.is(":visible")) {
			$(document).trigger('click')
			var c = ES.get(this)
			var v = c.data('value')
			c.data('value', '')
			filter_geo.apply(this, [v])
			c.data('value', v)
			c.show()
		}
		e.preventDefault()
		return false
	})
	ret.etype = 'text'
	ES.ui.add(ret.id, ret)
	return ret
}
/**
 *带[港口信息]输入联想的input
 * @param  config  控件设置项对象
 * @param  {String} config.module  港口信息区分[内贸整箱、外贸整箱、外贸拼箱]---both:全部；DomesticShippingSpu:内贸；ForeignTrunkSpu:外贸；LclSpu:拼箱
 * @param  {String} config.type  标识起始港还是目的港---from:查找起始港港口；to:查找目的港港口
 * @param  {String} config.param 其他参数
 */
ES.ui.input_port = function(config) {
	var ret = ES.ui.input(config)
	ret.param = config.param ? config.param : {}
	ret.returnValue = config.returnValue
	ret.afterFunction = config.afterFunction
	ret.editable = config.editable
	ret.uppercase = config.uppercase
	ret.get_value = function() {
		return this.el.data('value') ? this.el.data('value') : ''
	}
	ret.get_display_value = function() {
		return this.el.val()
	}
	ret.set_display_value = function(val) {
		return this.el.val(val)
	}
	ret.set_value = function(val) {
		var g = this
		var find_geo_callback = function(res) {
			if (!res.ports || res.ports.length <= 0) {
				return
			}
			res = res.ports[0]
			if (ES.lang == 'en-us') {
				g.el.val(res.nameEn)
			} else {
				if(g.returnValue == 'en-name'){
					g.el.val(res.nameEn)
				} else if(g.returnValue == 'figure-five'){
					g.el.val(res.code)
				} else {
					g.el.val(res.name)
				}
			}
			if(g.el.hasClass('change-input')) g.el.trigger('change')
		}
		ES.util.ajax_get('/geo/find_port_by_code', {
			code: val
		}, find_geo_callback)
		return this.el.data('value', val)
	}
	ret.clear_value = function() {
		return this.el.val('').data('value', '')
	}
	ret.dataUrl = config.dataUrl
	ret.set_preference = function(list) {
		this.preference = list
	}
	var table = $('<div class="input-drop input-port-drop" data-value="' + ret.id + '" id="' + ret.id + '-drop"></div>')
	$('body').append(table)
	var type = config.type
	var related = config.related
	var module = config.module
	var both = config.module == 'both'
	var isLoadDate = false
	var filter_geo = function(value, scope) {
		var input = $(this)
		var inputValue = input.val()
		var drop = $('#' + input.attr('id') + '-drop')
		if (!inputValue) {
			inputValue = ''
		}
		var ws = '/port/query'
		if ('from' == type) {
			if (both) {
				ws = '/port/query_both_from_port'
			} else {
				ws = '/port/query_from_port'
			}
		} else if ('to' == type) {
			if (both) {
				ws = '/port/query_both_to_port'
			} else {
				ws = '/port/query_to_port'
			}
		}
		if(scope.dataUrl){
			ws = scope.dataUrl
		}
		var port = ''
		if (related && ES.ui.get(related)) {
			port = ES.ui.get(related).get_value()
		}
		var width = input.outerWidth() - 22
		width = width <= 200 ? 200 : width
		var height = input.outerHeight()
		var offset = input.offset()
		if(config.multipleFlag) {
			height = input.parent().outerHeight()
			offset = input.parent().offset()
		}

		var poupFlag = input.closest('.popup').length>0?true:false
		var infactTop = offset.top + height
		if(poupFlag){
			infactTop = infactTop-$(document).scrollTop()
		}
		drop.css({
			top: infactTop,
			left: offset.left,
			'min-width': width,
			'position':poupFlag ? 'fixed' : 'absolute'
		})
		var reqData = ES.util.merge({
			q: inputValue,
			port: port,
			type: module
		}, ret.param)
		if(config.countryId){
			reqData.country = config.countryId;
		}
		if(isLoadDate){
			isLoadDate = false
			ES.util.ajax_get(ws,reqData , function(res) {
				ES.port = res;
			})
			return
		}
		drop.empty().html('<div class="input-port-item" data-value="-1">' + ES.msg.get('loading') + '</div>').show()
		var show_port = function (res, scope) {
			var out = []
			var selected = false
			var preference = ES.ui.get(input.attr('id')).preference
			if(preference) {
				out.push('<div class="input-port-sep" data-value="-1">' + ES.msg.get('preference') + '</div>')
				ES.each(preference,function(_,v){
					if (ES.lang == 'en-us') {
						out.push('<div class="input-port-item " data-value="' + v.code + '" data-type="' + v.type + '">' +
							'<span style="float:right">' + v.code + '</span><span class="port-name">' + v.nameEn + '</div>')
					} else {
						out.push('<div class="input-port-item " data-value="' + v.code + '" data-type="' + v.type + '">' +
							'<span style="float:right">' + v.code + '</span><span class="port-name">' + v.name + '</span> - <span class="en-name">' + v.nameEn + '</span></div>')
					}
				})
			}
			if (!res.ports || res.ports.length <= 0) {
				if(!scope.editable){
					out.push('<div class="input-port-item" data-value="-1">' + ES.msg.get('default_empty_result') + '</div>')
				}
				input.data('value', '')
			} else {
				var filter = {}
				var ports = res.ports
				ES.each(ports, function(_, v) {
					filter[v.code] = v
				})
				var t_p = []
				for (var p in filter) {
					if(filter.hasOwnProperty(p)){
						t_p.push(filter[p])
					}
				}
				t_p.sort(function(a, b) {
					return a.nameEn > b.nameEn ? 1 : -1
				})
				var group = t_p[0].nameEn[0]
				var value = input.val().toLocaleUpperCase();
				// not display group title
				// out.push('<div class="input-port-sep" data-value="-1">' + group + '</div>')
				ES.each(t_p, function(_, v) {
					if (group != v.nameEn[0]) {
						group = v.nameEn[0]
						// not display group title
						// out.push('<div class="input-port-sep" data-value="-1">' + group + '</div>')
					}
					if (ES.lang == 'zh-cn') {
						var name = v.name || ""
						var code = v.code || ""
						var nameEn = v.nameEn || ""
						name = name.toLocaleUpperCase()
						nameEn = nameEn.toLocaleUpperCase()
						code = code.toLocaleUpperCase()
						if (!(name.indexOf(value) >= 0) && !(code.indexOf(value) >= 0) && !(nameEn.indexOf(value) >= 0)) {
							return true
						}
					}
					var cls = ''
					v.type = v.type ? v.type : ''
					if (input.val() == v.name || input.val() == v.nameEn || input.val() == v.code) {
						cls = 'input-port-item-selected'
						input.data('value', v.code).data('type', v.type)
						selected = true
					}
					if (ES.lang == 'en-us') {
						out.push('<div class="input-port-item ' + cls + '" data-value="' + v.code + '" data-type="' + v.type + '">' +
							'<span style="float:right">' + v.code + '</span><span class="port-name">' + v.nameEn + '</div>')
					} else {
						out.push('<div class="input-port-item ' + cls + '" data-value="' + v.code + '" data-type="' + v.type + '">' +
							'<span style="float:right">' + v.code + '</span><span class="port-name">' + v.name + '</span> - <span class="en-name">' + v.nameEn + '</span></div>')
					}
				})
			}
			if(out.length > 10){
				out = out.splice(0,10);
			}else if(out.length <= 0){
				if(!scope.editable){
					out.push('<div class="input-port-item" data-value="-1">' + ES.msg.get('default_empty_result') + '</div>')
				}

				input.data('value', '')
			}
			drop.empty().html(out.join('')).show()
			if (!selected) {
				drop.children('div.input-port-item').eq(0).addClass('input-port-item-selected')

				if(inputValue && !scope.editable) {
					input.data('value', drop.children('div.input-port-item').eq(0).data().value).data('type', drop.children('div.input-port-item').eq(0).data().type)
				}
			}
			drop.children('div.input-port-item').on('click', function(e) {
				var v = $(this)
				var tar = $('#' + v.parent().data().value).val(v.children('.port-name').html())
				if (v.data().value <= 0) {
					tar.data('value', '').data('type', '')
					if(!scope.editable){
						tar.val('')
					}
					v.parent().hide()
					e.preventDefault()
					return false
				}
				tar.data('value', v.data().value).data('type', v.data().type).trigger('change',[value])
				ES.event.fire(v.parent().data().value, 'change', v.data().value)
				if(scope.returnValue == 'en-name'){
					tar.val(v.find('.en-name').html()||v.find('.port-name').html())
					if(scope.uppercase){
						tar.val(tar.val().toUpperCase())
					}
					tar.siblings('.uneditable-label').html(v.find('.en-name').html()||v.find('.port-name').html())
				} else if(scope.returnValue == 'figure-five'){
					tar.val(v.find('span:eq(0)').html())
					if(scope.uppercase){
						tar.val(tar.val().toUpperCase())
					}
					tar.siblings('.uneditable-label').html(v.find('span:eq(0)').html())
				}
				if(scope.afterFunction){
					scope.afterFunction(v)
				}
				if(config.evenChange){
					config.evenChange();
				}
				v.parent().hide()
				e.preventDefault()
			})
		}
		var res;
		if(ES.lang == "zh-cn" && !config.keydownUpload){
			if(ES.port && this.value.length > 0){
				res = ES.port;
			}else if(this.value.length <= 0){
				res = ES.consts.china_commonly_used_port
			}
			show_port(res, scope);
		}else{
			ES.util.ajax_get(ws,reqData , function(res) {
				show_port(res, scope);
			})
		}
	}
	var intveral = null
	var inp = null
	var input_callback = function() {
		if(!inp)
			return
		var t_inp = $(inp)
		t_inp.data('value', t_inp.val())
		filter_geo.call(inp, null, ret)
	}
	if(window.attachEvent && document.getElementById(ret.id).onpropertychange){
		document.getElementById(ret.id).onpropertychange=function(){
			if(inp){
				ES.get('#' + ret.id).data().value = ''
				if (intveral != null) {
					clearTimeout(intveral)
					intveral = null
				}
				intveral = setTimeout(input_callback, 300)
			}
		}
	}else{
		ES.get('#' + ret.id).on('input',function(){
			if(inp){
				ES.get('#' + ret.id).data().value = ''
				if (intveral != null) {
					clearTimeout(intveral)
					intveral = null
				}
				intveral = setTimeout(input_callback, 300)
			}
		})
	}
	if(ES.lang == "zh-cn"){
		isLoadDate = true
		filter_geo.call(ret.el, null, ret)
	}
	ES.get('#' + ret.id).on('keydown', function(evt) {
		console.log(evt.which)
		inp = null
		var drop = $('#' + $(this).attr('id') + '-drop')
		var children = drop.children('div.input-port-item')
		if (evt.which == 13) {
			// enter
			drop.children('div.input-port-item-selected').eq(0).trigger('click')
			evt.preventDefault()
		} else if (evt.which == 9) {
			// tab
			if($(this).val()) {
				drop.children('div.input-port-item-selected').eq(0).trigger('click')
			} else {
				drop.hide()
			}
			// tab can not preventDefault since we need browser to do other things
		} else if (evt.which == 38) {
			// arrow top
			var total = children.length
			for (var i = 0; i < total; i++) {
				if (i > 0 && children.eq(i).hasClass('input-port-item-selected')) {
					children.eq(i).removeClass('input-port-item-selected')
					children.eq(i - 1).addClass('input-port-item-selected')
					break;
				}
			}
			evt.preventDefault()
		} else if (evt.which == 40) {
			// arrow down
			var total = children.length
			for (var i = 0; i < total; i++) {
				if (i < total - 1 && children.eq(i).hasClass('input-port-item-selected')) {
					children.eq(i).removeClass('input-port-item-selected')
					children.eq(i + 1).addClass('input-port-item-selected')
					break;
				}
			}
			evt.preventDefault()
		} else {
			if ((evt.which < 48 && evt.which != 32 && evt.which > 9) ||
				(evt.which > 105 && evt.which < 112) ||
				(evt.which > 123 && evt.which < 186)) {
				evt.preventDefault()
				return
			}
			inp = this
		}
	}).on('click', function(e) {
		e.preventDefault()
		return false
	}).on('focus', function(e) {
		var c = ES.get('#' + ES.get(this).attr('id') + '-drop')
		$(document).trigger('click')
		if (!c.is(":visible")) {
			//c.show()
			$(document).trigger('click')
			var c = ES.get(this)
			var v = c.data('value')
			c.data('value', '')
			filter_geo.call(this, v, ret)
			c.data('value', v)
		}
		e.preventDefault()
		return false
	})
	ret.etype = 'input_port'
	ES.ui.add(ret.id, ret)
	return ret
}

/**
 *
 */
ES.ui.input_port_multiple = function(config) {
	function MultiplePorts() {
		var ret = ES.ui.input_port(ES.util.merge(config, {multipleFlag: true, nonempty: false})),
			ele = ret.el,
			selectedData = {},
			minWidth = config.minWidth || 130,
			nonempty = config.nonempty
			wrapOffsetRight = 1 // padding-right + border-right-width  of wrap

		this.id = ret.id
		this.el = ele
		this.msg_type = config.msg_type
		this.customer_validate = config.validate

		this.get_value = function() {
			var values = []
			for(var attr in selectedData) {
				selectedData.hasOwnProperty(attr) && selectedData[attr] && values.push(selectedData[attr]['value'])
			}
			return values
		}

		this.set_value = function(values) {
			for(var i = 0, len = values.length; i < len; i++) {
				add_item(values[i])
			}
			return this
		}

		this.clear_value = function() {
			ele.parent().find('.selected-item').remove()
			selectedData = {}
			return this
		}

		this.get_display = function() {
			var values = []
			for(var attr in selectedData) {
				selectedData.hasOwnProperty('attr') && selectedData[attr] && values.push(selectedData[attr]['display'])
			}
			return values
		}

		this.disable = function() {
            this.el.css('display', 'none')
            this.el.parent().css('border', 'none').find('.item-remove').css('display', 'none')
            return this
        }

		this.set_msg = function(msg) {
			// this.msg = msg
			if (this.msg_type && this.msg_type == 'tips') {
				var tips = '<div class="msg-tip error">' + msg + '</div>'
				ES.get(tips).insertBefore(ele.parent())
			} else if(this.msg_type && this.msg_type == 'popup-tips'){
				//错误类型 默认error warn
				var error_style = config.msg_style || 'error'
				var i_cls = 'fa-times-circle'
				switch (error_style){
					case 'warn':
						i_cls = 'fa-exclamation-circle'
						break;
					default:
						break;
				}
				ES.get('.main-popup-error').children().hide()
				ES.get('.main-popup-error').show().find('.popup-'+error_style).html('<i class="fa '+i_cls+'"></i> ' + msg).show()
				ele.parent().addClass(error_style+'_frame')
			}else{
				function findMsg(el){
					var i_cls = 'fa-times-circle'
					if(el.parent().children('.msg').length==0){
						findMsg(el.parent())
					} else {
						el.parent().parent().parent().children('.msg').addClass('error').html('<i class="fa '+i_cls+'"></i> ' + msg).show()
					}
				}
				if(ele.attr('type') != 'hidden'){
					findMsg(this.el)
				}
			}
		}

		this.validate = function() {
			this.clear_invalid()
			var result = true
			if (nonempty && !this.get_value().length) {
				this.set_msg(ES.msg.get('non_empty'))
				result = false
			}
			if (result && this.customer_validate) {
				result = this.customer_validate()
			}
			return result
		}

		this.clear_invalid = function() {
			ele.parent().removeClass('error_frame')
			return this
		}

		this.set_nonempty = function(bool) {
			nonempty = bool
			return this
		}

		this.hide = function() {
			ele.closest('.input-wrap').hide()
			return this
		}

		this.show = function() {
			ele.closest('.input-wrap').show()
			return this
		}

		// 添加 或 删除 一条数据后 调整输入框的宽度
		function adjustInputWidth() {
			var $wrap = ele.parent(),
				wrapLeft = $wrap.offset().left + $wrap.outerWidth() - wrapOffsetRight,
				$selectedItems = $wrap.find('.selected-item'),
				$lastItem,
				lastItemLeft,
				diffVal

			if($selectedItems.length === 0) {
				ele.css('width', $wrap.width() + 'px')
			} else {
				$lastItem = $selectedItems.last()
				lastItemLeft = $lastItem.offset().left + $lastItem.outerWidth(true)
				diffVal = wrapLeft - lastItemLeft
				if(diffVal < minWidth) {
					ele.css('width', $wrap.width() + 'px')
				} else {
					ele.css('width', diffVal + 'px')
				}
			}
		}

		function add_item(obj) {
			var item,
				title = ''

			if(!selectedData[obj.value]) {
				if(obj.display.length > 3) {
					title = obj.display
				}
				item = ['<div class="selected-item">',
							'<div class="selected-display" title='+ title +'>' + obj.display + '</div>',
							'<i data-id="' + obj.value + '" class="fa fa-times item-remove"></i>',
						'</div>'].join('')
				ele.before(item)
				adjustInputWidth()
				selectedData[obj.value] = obj
			}
		}

		ES.event.listen(ret.id, 'change', function(value) {
			var obj = {
				value: ret.get_value(),
				display: ret.get_display_value()
			}
			add_item(obj)
			ret.clear_value()
		})

		// 移除item
		$(document).on('click', '.item-remove', function() {
			var $this = ES.get(this)
			selectedData[$this.data('id')] = false
			$this.parent().remove()
			adjustInputWidth()
		})

		// 重构dom
		function refactorDom($target) {
			var $label = $target.prev()
			$label.addClass('select-left')
			$target.addClass('select-input')
			$target.wrap('<div class="select-right"><div class="select-wrap"></div></div>')
			$target.closest('.select-right').css('padding-left', $label.outerWidth(true))
			$target.css('width', $target.parent().width() + 'px')
		}
		refactorDom(ele)
	}

	var multiplePorts = new MultiplePorts()
	multiplePorts.etype = 'input_port_multiple'
	ES.ui.add(multiplePorts.id + '_multiple', multiplePorts)
	return multiplePorts
}

ES.ui.maskPopup = function(targetId) {
	var target = ES.get('#' + targetId),
		wrap = ES.get('<div></div>'),
		cover = ES.get('<div id="' + targetId + '_cover" class="popup-cover"><div class="cover-icon"></div></div>')

	wrap.css('position', 'relative')
	cover.css({
		height: target.outerHeight() + 'px',
		width: target.outerWidth() + 'px',
	})
	target.wrap(wrap).after(cover)
}
ES.ui.unMaskPopup = function(targetId) {
	ES.get('#' + targetId + '_cover').remove()
}

ES.ui.newConfirm = function(config, success, fail) {
	config = config || {}
	config = ES.util.merge({
		innerHTML: ''
	}, config)

	config.positiveBtnDisplay = config.positiveBtnDisplay || 'inline-block'

	var positiveBtnMsg = config.positiveBtnMsg || ES.msg.get('confirm')
	var cancelBtnMsg = config.cancelBtnMsg || ES.msg.get('cancel')
	config.innerHTML = '<div class="popup-common">' + config.innerHTML + '</div><div class="clear"></div><div class="main-popup-error" style="display: none"><div class="popup-error"></div><div class="popup-warn"></div></div><div class="clear"></div><div class="popup-btn">' +
		'<span style="margin-right: 8px;"><a href="javascript:void(0);" class="btn btn-reverse">' + cancelBtnMsg + '</a></span>' +
		'<span><a href="javascript:void(0);" class="btn btn-major" style="display: '+config.positiveBtnDisplay +';">' + positiveBtnMsg + '</a></span><div class="clear"></div></div>'
	config.auto_hide = false
	config.auto_hide_default = false
	var ret = ES.ui.popup(config)

	$('.popup .popup-btn .btn-major').click(function(e) {
		if(ES.get(this).hasClass("disabled")){
			return;
		}
		if(config.validateEven && !config.validateEven()){
			return;
		}
		ES.get(this).html("&nbsp;").addClass("onLoading disabled")
		if(config.request){
			var type = config.request.type,
				data = config.requestData() || {},
				url = config.request.url;
			if(type == "get"){
				ES.util.ajax_get(url,data,function (res) {
					$('.popup').remove();
					ES.ui.unmask();
					success(res);
				});
			}else if (type == "post"){
				ES.util.ajax_submit(url,data,function (res) {
					$('.popup').remove();
					ES.ui.unmask();
					success(res);
				});
			}
		}else{
			success()
		}
		e.preventDefault()
		// return false
	})

	$('.popup .popup-btn .btn-reverse').click(function(e) {
		if (fail && !fail()) {
			return
		}
		$('.popup').remove()
		ES.ui.unmask()
		e.preventDefault()
		// return false
	})
	return ret
}

ES.ui.modal = function(config) {
	var $modal = $('#myModal')
	function init() {
		var array
		if($modal.length === 0) {
			array = ['<div id="myModal" class="modal fade">',
				'<div class="modal-backdrop"></div>',
				'<div class="modal-dialog">',
				'<div class="modal-content">',
				'<div class="modal-header">',
				'<button class="close">',
				'<span>×</span>',
				'</button>',
				'<div class="modal-title"></div>',
				'</div>',
				'</div>',
				'</div>',
				'</div>']
			$modal = $(array.join(''))
			$('body').append($modal)
		}
		bind_event()
	}
	function show(msg, type) {
		var msgIcon = ''

		if(type === 'error') {
			msgIcon = '<i class="fa fa-times-circle" aria-hidden="true"></i>'
		} else if(type === 'warning'){
			msgIcon = '<i class="fa fa-exclamation-triangle" aria-hidden="true"></i>'
		}
		$modal.find('.modal-title').html(msgIcon + msg)
		$modal.show()
		setTimeout(function() {
			$modal.addClass('in').children().eq(0).addClass('in')
		}, 0)
	}
	function hide() {
		var closeCallback = config.closeCallback
		$modal.removeClass('in')
		setTimeout(function() {
			$modal.hide()
			closeCallback && closeCallback()
		}, 200)
	}

	function bind_event() {
		ES.get(document).off('click', '#myModal .close')
		ES.get(document).on('click', '#myModal .close', function() {
			hide()
		})
		ES.get(document).off('click', '#myModal .modal-backdrop')
		ES.get(document).on('click', '#myModal .modal-backdrop', function() {
			hide()
		})
	}

	init()
	show(config.msg, config.type)

	//if(ES.ui.get('myModal')) {
	//	return ES.ui.get('myModal')
	//}
	//var modal = new Modal()
	//ES.ui.add(modal.id, modal)
	//return modal
}

