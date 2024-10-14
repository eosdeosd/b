var rule = {
    title: '量子',
    host: 'https://cj.lziapi.com',
    homeUrl: '/api.php/provide/vod?ac=detail',
    searchUrl: '/api.php/provide/vod?ac=detail&wd=**&pg=fypage',
    detailUrl: '/api.php/provide/vod?ac=detail&ids=fyid', //非必填,二级详情拼接链接
    searchable: 2,
    quickSearch: 0,
    filterable: 1,
    play_parse: true,
    lazy:`js:
        var html = JSON.parse(request(input).match(/r player_.*?=(.*?)</)[1]);
        var url = html.url;
        var from = html.from;
        if (html.encrypt == '1') {
            url = unescape(url)
        }else if(/lzm3u8/.test(input)){
    play_Url='json:https://jx.m3u8.biz/gg.php?url=';
    input={jx:0,url:input,playUrl:play_Url,parse:1}
} else if (html.encrypt == '2') {
            url = unescape(base64Decode(url))
        }
        if (/m3u8|mp4/.test(url)) {
            input = url
        } else {
            var jx =request(HOST + "/static/player/" + from + ".js").match(/ src="(.*?)'/)[1];
			log(jx)
            let con=request(jx.replace('index','ec')+ url, {headers: {'Referer': HOST}}).match(/let ConFig.*}/)[0];
			log(con)
			eval(con+'\\nrule.ConFig=ConFig')
			function ec(str, uid) {
				eval(getCryptoJS());
				return CryptoJS.enc.Utf8.stringify(CryptoJS.AES.decrypt(str, CryptoJS.enc.Utf8.parse('2890' + uid + 'tB959C'), {
					iv: CryptoJS.enc.Utf8.parse('2F131BE91247866E'),
					mode: CryptoJS.mode.CBC,
					padding: CryptoJS.pad.Pkcs7
				}));
			};
			//log(rule.ConFig.url)
			//log(rule.ConFig.config.uid)
			let purl=ec(rule.ConFig.url, rule.ConFig.config.uid);
			//log(purl)
			input = {
			   jx: 0,
			   url: purl,
			   parse:0,
			}
        }`,
    multi: 1,
    timeout: 5000,
    limit: 6,
    url: '/api.php/provide/vod?ac=detail&t=fyclass&pg=fypage&f=',
    class_name: '国产剧&香港剧&韩国剧&动作片&剧情片&喜剧片&爱情片&国产动漫',
    class_url: '13&14&15&6&11&7&8&29',
    推荐: 'json:list;vod_name;vod_pic;vod_remarks;vod_id', // double: true, // 推荐内容是否双层定位
    // 一级: 'json:list;vod_name;vod_pic;vod_remarks;vod_id',
    一级: `js:
        function getParam(url,name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = url.split('?')[1].match(reg); //获取url中"?"符后的字符串并正则匹配
            var context = "";
            if (r != null)
                context = decodeURIComponent(r[2]);
            reg = null;
            r = null;
            return context == null || context == "" || context == "undefined" ? "" : context;
        }
        let d = [];
        // 忽略分类
        let cate_exclude = '34,35,45';
        let type_id = getParam(input,'t');
        if(!cate_exclude.match(type_id)){
            let html = request(input);
            let list = JSON.parse(html).list;
            list.forEach(function (it){
                if(!cate_exclude.match(it.type_id)){
                    d.push({
                        title:it.vod_name,
                        img:it.vod_pic,
                        desc:it.vod_remarks,
                        url:it.vod_id
                    });
                }
            });
        }
        setResult(d);
        // log(input);
    `,
    /**
     * 资源采集站，二级链接解析
     */
    // 二级: `json:list;vod_name;vod_pic;vod_remarks;vod_id`,
    二级: `js:
        let html = request(input);
        let list = JSON.parse(html).list;
        if(list.length===1){
           VOD = list[0];
            VOD.vod_blurb = VOD.vod_blurb.replace(/　/g, '').replace(/<[^>]*>/g, '');
            VOD.vod_content = VOD.vod_content.replace(/　/g, '').replace(/<[^>]*>/g, '');
        }
    `,
    /**
     * 搜索解析 过滤部分资源
     */
    // 搜索: 'json:list;vod_name;vod_pic;vod_remarks;vod_id',
    搜索: `js:
        let d = [];
        // 忽略分类
        let cate_exclude = '34,35,45';
        let html = request(input);
        let list = JSON.parse(html).list;
        list.forEach(function (it){
            if(!cate_exclude.match(it.type_id)){
                d.push({
                    title:it.vod_name,
                    img:it.vod_pic,
                    desc:it.vod_remarks,
                    url:it.vod_id
                });
            }
        });
        setResult(d);
    `,
}
