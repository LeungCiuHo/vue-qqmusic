import axios from 'axios'
import qs from 'qs'

export let ERROR_OK = 0	//返回正常状态码
export let NO_LYRIC = -1901 //返回无歌词状态码 目前只用于singer.vue页面
export let NO_FOUND = 404 //状态码返回404
//推荐页接口
export function getRecomment(callback){
    axios('/api/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg',{
        params:{
            g_tk: 5381,
            uin: 0,
            format: 'json',
            inCharset: 'utf-8',
            outCharset: 'utf-8',
            notice: 0,
            platform: 'h5',
            needNewCode: 1,
            _: 1545886811612
        }
    }).then(data=>{
        callback(data)
    }).catch(error=>{
        callback(error)
    })
}

//排行榜接口
export function getRanking(callback){
    let date = new Date().getTime()
    axios('/api/v8/fcg-bin/fcg_myqq_toplist.fcg',{
        params:{
            g_tk: 5381,
            uin: 0,
            format: 'json',
            inCharset: 'utf-8',
            outCharset: 'utf-8',
            notice: 0,
            platform: 'h5',
            needNewCode: 1,
            _: date,
        }
    }).then(data=>{
        callback(data)
    }).catch(error=>{
        callback(error)
    })
}

//热门搜索接口
export function getSearch(callback){
    let date = new Date().getTime()
    axios('/api/splcloud/fcgi-bin/gethotkey.fcg',{
        params:{
            g_tk: 5381,
            uin: 0,
            format: 'json',
            inCharset: 'utf-8',
            outCharset: 'utf-8',
            notice: 0,
            platform: 'h5',
            needNewCode: 1,
            _: date
        }
    }).then(response=>{
        callback(response)
    }).catch(error=>{
        callback(error)
    })
}

//搜索列表接口
export function getSearchSongList(w,p,callback){
    let date = new Date().getTime()
    axios('/api/soso/fcgi-bin/search_for_qq_cp',{
        params:{
            g_tk: 5381,
            uin: 0,
            format: 'json',
            inCharset: 'utf-8',
            outCharset: 'utf-8',
            notice: 0,
            platform: 'h5',
            needNewCode: 1,
            w: w,
            zhidaqu: 1,
            catZhida: 1,
            t: 0,
            flag: 1,
            ie: 'utf-8',
            sem: 1,
            aggr: 0,
            perpage: 20,
            n: 20,
            p: p,
            remoteplace: 'txt.mqq.all',
            _: date
        }
    }).then(response=>{
        callback(response)
    }).catch(error=>{
        callback(error)
    })
}

//热门歌单列表接口
export function getSongList(disstid,song_begin,callback){
    let date = new Date().getTime()
    axios('/api/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg',{
        params:{
            g_tk: 5381,
            uin: 0,
            format: 'json',
            inCharset: 'utf-8',
            outCharset: 'utf-8',
            notice: 0,
            platform: 'h5',
            needNewCode: 1,
            new_format: 1,
            pic: 500,
            disstid: disstid,
            type: 1,
            json: 1,
            utf8: 1,
            onlysong: 0,
            picmid: 1,
            nosign: 1,
            song_begin: song_begin,
            song_num: 15,
            _: date
        }
    }).then(response=>{
        callback(response)
    }).catch(error=>{
        callback(error)
    })
}

//排行榜歌单列表接口
export function getToplist(topid,callback){
    let date = new Date().getTime()
    axios('/api/v8/fcg-bin/fcg_v8_toplist_cp.fcg',{
        params:{
            g_tk: 5381,
            uin: 0,
            format: 'json',
            inCharset: 'utf-8',
            outCharset: 'utf-8',
            notice: 0,
            platform: 'h5',
            needNewCode: 1,
            tpl: 3,
            page: 'detail',
            type: 'top',
            topid: topid,
            _: date
        }
    }).then(response=>{
        callback(response)
    }).catch(error=>{
        callback(error)
    })
}

//搜索歌单列表接口
export function getSinger(singermid,begin,callback){
    let date = new Date().getTime()

    axios('/api/v8/fcg-bin/fcg_v8_singer_track_cp.fcg',{
        params:{
            singermid: singermid,
            g_tk: 5381,
            uin: 0,
            format: 'json',
            inCharset: 'utf-8',
            outCharset: 'utf-8',
            notice: 0,
            platform: 'h5page',
            needNewCode: 1,
            order: 'listen',
            from: 'h5',
            num: 15,
            begin: begin,
            _: date
        }
    }).then(response=>{
        callback(response)
    }).catch(error=>{
        callback(error)
    })
}

//获得songmid传过来获取对应的vkey  其实purl就是播放源了  拿到purl就可以了  可以不执行getVideo接口
export function getvkey(songmid,callback){
    axios.defaults.transformRequest = [function (data) {
        let ret = ''
        for (let it in data) {
            ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
        }
        return ret
    }]
    let date = new Date().getTime()
    axios({
        url:'/vkey/cgi-bin/musicu.fcg?_='+date,
        method: 'post',
        data: {

        },
        transformRequest: [function () {
            return `{"req_0":{"module":"vkey.GetVkeyServer","method":"CgiGetVkey","param":{"guid":"8326724064","songmid":${songmid},"songtype":[],"uin":"0","loginflag":0,"platform":"23","h5to":"speed"}},"comm":{"g_tk":5381,"uin":0,"format":"json","ct":23,"cv":0}}`
        }],
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).then(response=>{
        callback(response)
    }).catch(error=>{
        callback(error)
    })
}

// export function getVideo(purl,callback){
// 	axios.get(`http://183.60.23.28/amobile.music.tc.qq.com/${purl}`,{
// 		headers: {
// 			'Content-Type': 'audio/mp4',
// 	  	}
// 	}).then(response=>{
// 		callback(response)
// 	}).catch(error=>{
// 		callback(error)
// 	})
// }


//获取歌词接口
export function getLyric(musicid,callback){
    let date = new Date().getTime()
    axios('/api/lyric/fcgi-bin/fcg_query_lyric.fcg',{
        params:{
            g_tk: 5381,
            uin: 0,
            format: 'jsonp',
            inCharset: 'utf-8',
            outCharset: 'utf-8',
            notice: 0,
            platform: 'h5',
            needNewCode: 1,
            nobase64: 1,
            musicid: musicid,
            songtype: 0,
            _: date,
            jsonpCallback: 'jsonp'
        }
    }).then(response=>{
        callback(response)
    }).catch(error=>{
        callback(error)
    })
}


//专辑歌单接口
export function getAlbum(albummid,callback){
    let date = new Date().getTime()
    axios('/api/v8/fcg-bin/fcg_v8_album_info_cp.fcg',{
        params:{
            albummid:albummid,
            g_tk: 5381,
            uin: 0,
            format: 'json',
            inCharset: 'utf-8',
            outCharset: 'utf-8',
            notice: 0,
            platform: 'h5',
            needNewCode: 1,
            _: date
        }
    }).then(response=>{
        callback(response)
    }).catch(error=>{
        callback(error)
    })
}
//专辑其他歌单接口
export function getOtherAlbum(albummid,callback){
    let date = new Date().getTime()
    axios('/api/v8/fcg-bin/fcg_v8_album_info_cp.fcg',{
        params:{
            albumid:albummid,
            g_tk: 5381,
            uin: 0,
            format: 'json',
            inCharset: 'utf-8',
            outCharset: 'utf-8',
            notice: 0,
            platform: 'h5',
            needNewCode: 1,
            _: date
        }
    }).then(response=>{
        callback(response)
    }).catch(error=>{
        callback(error)
    })
}


//歌曲详情接口  视频、音乐
export function getmusicu(songid,callback){
    axios.defaults.transformRequest = [function (data) {
        let ret = ''
        for (let it in data) {
            ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
        }
        return ret
    }]
    let date = new Date().getTime()
    axios({
        url: '/vkey/cgi-bin/musicu.fcg?_='+date,
        method: 'post',
        data: {

        },
        transformRequest: [function () {
            return `{"comm":{"g_tk":5381,"uin":1666584574,"format":"json","inCharset":"utf-8","outCharset":"utf-8","notice":0,"platform":"h5","needNewCode":1},"detail":{"module":"music.pf_song_detail_svr","method":"get_song_detail","param":{"song_id":${songid}}},"simsongs":{"module":"rcmusic.similarSongRadioServer","method":"get_simsongs","param":{"songid":${songid}}},"gedan":{"module":"music.mb_gedan_recommend_svr","method":"get_related_gedan","param":{"sin":0,"last_id":0,"song_type":1,"song_id":${songid}}},"video":{"module":"MvService.MvInfoProServer","method":"GetSongRelatedMv","param":{"songid":"${songid}","songtype":1,"lastmvid":0,"num":5}}}`
        }],
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).then(response=>{
        callback(response)
    }).catch(error=>{
        callback(error)
    })
}

//获取评论接口
export function getreplay(topid,callback){
    let date = new Date().getTime()
    axios('/api/base/fcgi-bin/fcg_global_comment_h5.fcg',{
        params:{
            g_tk: 959037872,
            uin: 0,
            format: 'json',
            inCharset: 'utf-8',
            outCharset: 'utf-8',
            notice: 0,
            platform: 'h5',
            needNewCode: 1,
            cid: 205360772,
            reqtype: 1,
            cmd: 8,
            needmusiccrit: 0,
            pagesize: 3,
            lasthotcommentid: 0,
            qq: 0,
            msg_comment_id:'' ,
            pagenum: 0,
            biztype: 1,
            topid: topid,
            ct: 999,
            _: date
        },
        headers:{
            'content-type': 'application/json;charset=utf-8'
        }
    }).then(response=>{
        callback(response)
    }).catch(error=>{
        callback(error)
    })
}

//获取专辑评论接口
export function getalbumreplay(topid,callback){
    let date = new Date().getTime()
    axios('/api/base/fcgi-bin/fcg_global_comment_h5.fcg',{
        params:{
            g_tk: 959037872,
            uin: 0,
            format: 'json',
            inCharset: 'utf-8',
            outCharset: 'utf-8',
            notice: 0,
            platform: 'h5',
            needNewCode: 1,
            cid: 205360772,
            reqtype: 1,
            cmd: 6,
            needmusiccrit: 0,
            pagesize: 10,
            lasthotcommentid: 0,
            qq: 0,
            msg_comment_id:'' ,
            pagenum: 0,
            biztype: 2,
            topid: topid,
            ct: 888,
            _: date
        },
        headers:{
            'content-type': 'application/json;charset=utf-8'
        }
    }).then(response=>{
        callback(response)
    }).catch(error=>{
        callback(error)
    })
}


//获取音频vkey(获取的purl是完整链接)接口
export function getaudiovkey(songmid,callback){
    axios('/vkey/cgi-bin/musicu.fcg',{
        params:{
            '-':'getplaysongvkey18692067669581247',
            g_tk: 5381,
            loginUin: 0,
            hostUin: 0,
            format: 'json',
            inCharset: 'utf8',
            outCharset: 'utf-8',
            notice: 0,
            platform: 'yqq.json',
            needNewCode: 0,
            data:`{"req":{"module":"CDN.SrfCdnDispatchServer","method":"GetCdnDispatch","param":{"guid":"1595362978","calltype":0,"userip":""}},"req_0":{"module":"vkey.GetVkeyServer","method":"CgiGetVkey","param":{"guid":"1595362978","songmid":["${songmid}"],"songtype":[0],"uin":"0","loginflag":1,"platform":"20"}},"comm":{"uin":0,"format":"json","ct":20,"cv":0}}`
        },
        headers:{
            'content-type': 'text/plain; charset=utf-8'
        }
    }).then(response=>{
        callback(response)
    }).catch(error=>{
        callback(error)
    })
}

//获取电台音频列表 随机20条
export function getradiosonglist(callback){
    let date = new Date().getTime()
    axios('/api/v8/fcg-bin/fcg_v8_radiosonglist.fcg',{
        params:{
            labelid: 199,
            g_tk: 5381,
            uin: 0,
            format: 'json',
            inCharset: 'utf-8',
            outCharset: 'utf-8',
            notice: 0,
            platform: 'h5',
            needNewCode: 1,
            _: date
        },
        headers:{
            'content-type': 'text/plain; charset=utf-8'
        }
    }).then(response=>{
        callback(response)
    }).catch(error=>{
        callback(error)
    })
}

//获取歌曲视频
export function getplaysongVideoUrl(vid,callback){
    let date = new Date().getTime()
    axios('/vkey/cgi-bin/musicu.fcg',{
        params:{
            g_tk: 5381,
            uin: 0,
            ct: 23,
            cv: 0,
            format: 'json',
            callback: 'qmv_jsonp_6',
            data: `{"getMVInfo":{"module":"video.VideoDataServer","method":"get_video_info_batch","param":{"vidlist":["${vid}"],"required":["vid","sid","gmid","type","name","cover_pic","video_switch","msg"],"from":"h5.playsong"}},"getMVUrl":{"module":"gosrf.Stream.MvUrlProxy","method":"GetMvUrls","param":{"vids":["${vid}"],"from":"h5.playsong"},"request_typet":10001}}`,
            _: date
        },
        headers:{
            'content-type': 'text/plain; charset=utf-8'
        }
    }).then(response=>{
        callback(response)
    }).catch(error=>{
        callback(error)
    })
}

// 获取视频mv.vue
//获取歌曲视频
export function getmv(vid,callback){
    let date = new Date().getTime()
    axios('/vkey/cgi-bin/musicu.fcg',{
        params:{
            g_tk: 5381,
            uin: 0,
            format: 'json',
            inCharset: 'utf-8',
            outCharset: 'utf-8',
            notice: 0,
            platform: 'h5',
            needNewCode: 1,
            data: `{"getMVInfo":{"module":"video.VideoDataServer","method":"get_video_info_batch","param":{"vidlist":["${vid}"],"required":["vid","type","name","singers","playcnt","pubdate","uploader_headurl","uploader_nick","uploader_encuin","uploader_uin","uploader_follower_num","uploader_hasfollow","from","isfav","video_switch","desc","sid","gmid","cover_pic_medium"]}},"getToplistInfo":{"module":"video.VideoLogicServer","method":"get_hitlist_info","param":{"vid":"${vid}"}},"getRecomMV":{"module":"video.VideoLogicServer","method":"rec_video_byvid","param":{"vid":"${vid}","required":["vid","type","cover_pic_medium","name","singers","uploader_nick","playcnt"],"support":1}}}`,

            _: date
        },
        headers:{
            'content-type': 'text/plain; charset=utf-8'
        }
    }).then(response=>{
        callback(response)
    }).catch(error=>{
        callback(error)
    })
}

//获取音频vkey(获取的purl是完整链接)接口
export function getmvkey(songmid,callback){
    let date = new Date().getTime()
    axios('/vkey/cgi-bin/musicu.fcg',{
        params:{
            g_tk: 1856849048,
            uin: 1666584574,
            ct: 23,
            cv: 0,
            format: 'json',
            callback: 'qmv_jsonp_2',
            data:`{"getMVInfo":{"module":"video.VideoDataServer","method":"get_video_info_batch","param":{"vidlist":["${songmid}"],"required":["vid","sid","gmid","type","name","cover_pic","video_switch","msg"],"from":"h5.mvplay"}},"getMVUrl":{"module":"gosrf.Stream.MvUrlProxy","method":"GetMvUrls","param":{"vids":["${songmid}"],"from":"h5.mvplay"},"request_typet":10001}}`,
            _:date
        },
        headers:{
            'content-type': 'text/plain; charset=utf-8'
        }
    }).then(response=>{
        callback(response)
    }).catch(error=>{
        callback(error)
    })
}

//获取专辑评论接口
export function getmvreplay(topid,biztype,callback){
    let date = new Date().getTime()
    axios('/api/base/fcgi-bin/fcg_global_comment_h5.fcg',{
        params:{
            g_tk: 1856849048,
            uin: 1666584574,
            format: 'json',
            inCharset: 'utf-8',
            outCharset: 'utf-8',
            notice: 0,
            platform: 'h5',
            needNewCode: 1,
            cid: 205360772,
            reqtype: 1,
            cmd: 8,
            needmusiccrit: 0,
            pagesize: 10,
            lasthotcommentid: 0,
            qq: 1666584574,
            msg_comment_id: '',
            pagenum: 0,
            biztype: biztype,
            topid: topid,
            ct: 888,
            _: date
        },
        headers:{
            'content-type': 'application/json;charset=utf-8'
        }
    }).then(response=>{
        callback(response)
    }).catch(error=>{
        callback(error)
    })
}