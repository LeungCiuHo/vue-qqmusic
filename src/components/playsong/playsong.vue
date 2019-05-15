<template>
	<div id='playsong'>
		<pre v-show='false' ref="zhuanyi">
			<!-- 用于转义 不显示 -->
		</pre>
		<div class="back" @click="back">
			<i class="icon-back iconfont">
				<img src="@/assets/back.png" alt="">
			</i>
		</div>
		<div class="main"  v-if='data.detail && data.detail != null && data.detail != ""'>
			<div class="bg">
				<img :src="'https://y.gtimg.cn/music/photo_new/T002R300x300M000'+data.detail.data.track_info.album.mid+'.jpg?max_age=2592000'" alt="">
			</div>
			<div class="content">
				<div class='center_content'>
					<h1 class="song_name">{{data.detail.data.track_info.title}}&nbsp;<i class="iconfont menu_icon" @click="noOpen">&#xe611;</i></h1>
					<p class="song_author"><span v-for="singer of data.detail.data.track_info.singer">{{singer.name}}</span></p>
				</div>
				<transition name="fade-abosolute">
					<div v-show="album" @click="transformFun" class="album_div">
						<img class="album_img" :src="'https://y.gtimg.cn/music/photo_new/T002R300x300M000'+data.detail.data.track_info.album.mid+'.jpg?max_age=2592000'" alt="">
					</div>
				</transition>
				<div @click="transformFun" class="lyric bscroll" ref="bscroll">
					<ul v-if="arrLyric.length>0" class="lyricUl" >
						<li v-for="lyric of arrLyric">{{lyric.lyric}}</li>
					</ul>
				</div>
				<div class="viewmorelyric">
					<span class="view" @click="clickView">查看完整歌词<i class="iconfont">&#xe601;</i></span>
				</div>
				<div class="control_button">
					<span class="iconfont" @click="playpauseFun" v-if="playpause">&#xe6a5;</span>
					<span class="iconfont" @click="playpauseFun" v-else>&#xe63b;</span>
					<span class="iconfont" @click="clickView">&#xe60c;</span>
				</div>
				<!-- <audio ref='myaudio' v-show='true' controls autoplay :src='purl !=""?purl:""'></audio> -->
				<audio ref='myaudio' v-show='false' autoplay :src='purl !=""?purl:""'></audio>
				<button type="button" class='free_download' @click="clickView">免费下载歌曲</button>
			</div>
		</div>

		<div class="cnxht" v-if='data.simsongs && data.simsongs != null && data.simsongs != ""'>
			<h2 class='title'>猜你喜欢听</h2>
			<ul class="cnxh_ul">
				<li class=""  @click="clickView" v-for="songInfoList of data.simsongs.data.songInfoList" :key="songInfoList.id">
					<img class="cnxh_img" :src="'https://y.gtimg.cn/music/photo_new/T002R150x150M000'+songInfoList.album.mid+'.jpg?max_age=2592000'" alt="">
					<div class="name_dec">
						<h3 class="name">{{songInfoList.title}}</h3>
						<p class="dec"><span v-for="singer of songInfoList.singer">{{singer.name}}&nbsp;</span></p>
					</div>	
					<span class="iconfont gt">&#xe601;</span>
				</li>
			</ul>
		</div>
		<div class="zuixin_zhuanji" v-if='data.gedan && data.gedan != null && data.gedan != "" && data.gedan.data.vec_gedan.length>0'>
			<div class="zuixin_zhuanji">
				<h1 class="qui_tit__text">大家都在听</h1>
			</div>
			<ul class="zhuanji_ul">
				<li  @click="clickView" v-for="vec_gedan of data.gedan.data.vec_gedan">
					<div class="zj_div">
						<img class="zhuanji_img" :src="vec_gedan.imgurl" alt="">
						<h3 class="qui_equal_col__tit">{{vec_gedan.dissname}}</h3>
						<p class="qui_equal_col__desc">{{vec_gedan.creator}}</p>
					</div>
				</li>
			</ul>
		</div>
		<div class="cnxht" v-if='data.detail && data.detail != null && data.detail != ""'>
			<h2 class='title'>歌手与专辑</h2>
			<ul class="cnxh_ul">
				<li @click="clickView" v-for="singer of data.detail.data.track_info.singer">
					<img class="cnxh_img" :src="'https://y.gtimg.cn/music/photo_new/T001R150x150M000'+singer.mid+'.jpg?max_age=2592000'" alt="">
					<div class="name_dec">
						<h3 class="name">歌手&nbsp;<span>{{singer.name}}</span>&nbsp;</h3>
					</div>	
					<span class="iconfont gt">&#xe601;</span>
				</li>
				<li @click="clickView" class="">
					<img class="cnxh_img" :src="'https://y.gtimg.cn/music/photo_new/T002R300x300M000'+data.detail.data.track_info.album.mid+'.jpg?max_age=2592000'" alt="">
					<div class="name_dec">
						<h3 class="name">专辑：{{data.detail.data.track_info.album.name}}</h3>
					</div>	
					<span class="iconfont gt">&#xe601;</span>
				</li>
			</ul>
		</div>

		<div class="cnxht" v-if='comment.hot_comment && comment.hot_comment != "" && comment.hot_comment != null'>
			<h2 class='title'>精彩评论</h2>
			<div class="mt_top">
				<img class="mt_img" :src="comment.hot_comment.commentlist[0].avatarurl" alt="">
				<div class="mt_top_left">
					<h4><span>{{comment.hot_comment.commentlist[0].nick}}</span><img v-if='comment.hot_comment.commentlist[0].vipicon != ""' class="vipicon_icon" :src="comment.hot_comment.commentlist[0].vipicon" alt=""></h4>		
					<time v-html="time(comment.hot_comment.commentlist[0].time)"></time>
				</div>
				<span  @click="clickView" class="mt_top_right"><i>{{comment.hot_comment.commentlist[0].praisenum}}</i><i class="iconfont">&#xe609;</i></span>	
			</div>
			<pre class="replay_content" v-html='comment.hot_comment.commentlist[0].rootcommentcontent'></pre>
		</div>
		<div class="cnxht" v-if='data.video && data.video != null && data.video != "" && data.video.data.list.length>0' >
			<h2 class='title'>推荐音乐视频</h2>
			<div class="video_con" v-for='(videoItem,index) of data.video.data.list' :key='videoItem.mvid'>
				<div class="video_fm">
					<img :src="videoItem.picurl">
					<span class="cover_play" @click="playVideo($event,videoItem.vid)" :style="'background:url('+coverPlay+') top ;background-size:50px;'"></span>
				</div>
				<div class="video_detail">
					<h4>{{videoItem.title}}</h4>
					<p><span v-for='(singers,index) of videoItem.singers'>{{singers.name}}<i v-if='videoItem.singers.length > 0 && index<videoItem.singers.length-1'>&nbsp;/&nbsp;</i></span></p>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import {getmusicu,getreplay,getaudiovkey,getradiosonglist,getAlbum,getplaysongVideoUrl,ERROR_OK} from '@/api/getIndex'
	import BScroll from 'better-scroll'
	import $ from 'jquery'


	let twominu;

	export default{
		name:'playsong',
		data(){
			return{
				data:{},
				coverPlay:require('@/assets/cover_play.png'),
				comment:[],
				arrLyric:[],//歌词
				playpause:false,
				songid:[],//参数songid
				mid:[],
				getLyricmid:[],
				songidIndex:0,//默认第一条
				purl:"",
				stop:null,//歌词滚动定时器
				// transform3d:{
				// 	transform:'translate3d(0px, 116px, 0px)'
				// },
				transform:0,
				iValue:0,
				scrolling:false,
				album:true,//专辑封面图
				searchSongid:'',//搜索列表传过来的
				songmid:'',//搜索列表传过来的
			}
		},
		activated(){
			let that = this
			
			// 此处已不用缓存 注释了 方法一
			// that.mid = JSON.parse(localStorage.getItem('mid'))
			// that.getLyricmid = localStorage.getItem('getLyricmid')

			// 方法二
			if(that.$route.query.songid){
				that.songid = that.$route.query.songid.split(',')
			}
			if(that.$route.query.getLyricmid){
				that.getLyricmid = that.$route.query.getLyricmid.split(',')
			}
			if(that.$route.query.mid){
				that.mid = that.$route.query.mid.split(',')
			}
			
			if(that.$route.query.searchSongid){
				that.searchSongid = that.$route.query.searchSongid
			}
			if(that.$route.query.songmid){
				that.songmid = that.$route.query.songmid
			}

			that._getmusicu()//视频接口
			that._getreplay()//评论接口

			//封面图渐变消失
			setTimeout(()=>{
				that.album = false
			},1200)
		},
		deactivated(){
			let that = this
			that.playpause = false
			that.$Indicator.close()
			that.data = {}
			that.purl = ""
			that.comment = []
			that.arrLyric = []
			that.iValue = 0
			that.stop = null
			that.album = true
			that.songidIndex = 0
			that.songmid = ""
			that.searchSongid = ""
			that.songid = []
			that.getLyricmid = []
			that.mid = []
			that.transform = 0
			that.scrolling = false
		},
		methods:{
			back() {
				this.$router.back()
			},
			bscroll(){
				let that = this
				that.$nextTick(() => {
					// 初始化better-scroll滚动
					that.scroll = new BScroll(that.$refs.bscroll, {
	                    click: true,
	                    scrollY:true,
	                    probeType: 1,
	                    bindToWrapper:true,
	                    disableTouch:false,
	                    stopPropagation:true,
	                    bounce:true,
	                    pullUpLoad:{
	                      	threshold: 0, // 当上拉到超过底部 0px 时，
	                  	}
	                })
	                // that.$refs.bscroll.style.height = '200px'
                	that.scroll.refresh()

	                this.scroll.on('scroll', (pos) => {
	                	clearTimeout(twominu)
	                	that.scrolling = true
	                })
	                this.scroll.on('scrollEnd', (pos) => {
	                	twominu = setTimeout(()=>{
                			that.scrolling = false
	                	},1500)
	                	
	                })
				})
			},
			_getmusicu(){
				let that = this

				getmusicu(that.songid.length>0?that.songid[that.songidIndex]:that.searchSongid,res=>{
					console.log(res)
					if(res.data.code == ERROR_OK){
						that.data = res.data
						let info = res.data.detail.data.info
						for(let i in info){
							if(info[i].type == "lyric"){
								//拿到的歌词时间用HTML标签转义 
								that.$refs.zhuanyi.innerHTML = info[i].content[0].value
								//从HTML标签获得转义后的歌词数据并清空HTML的时间歌词数据
								let divlyric = that.$refs.zhuanyi.innerHTML
								that.$refs.zhuanyi.innerHTML = ""
								let lyrictime = [] //用数组存储歌词和时间
								//提取歌词
								let temparrLyric = divlyric.toString().split(/\[\d\d\:\d\d.\d\d\]/ig).splice(1);
								//提取时间  并把时间传进timeTmm函数转换成毫秒数
								var mm = that.timeTmm(divlyric.toString().match(/\[\d\d\:\d\d.\d\d\]/ig));
								for(let i in temparrLyric){
									//筛选有歌词不等于换行  因为有些歌词是空的 是一个换行符 则需要去除
									if(temparrLyric[i] != '\n'){
										lyrictime.push({
											'lyric':temparrLyric[i],
											'time':mm[i]
										})
									}
								}
								//歌词时间存进data
								that.arrLyric = lyrictime

								//获取音频
								that._getaudiovkey()
							}
						}
					}else{
						console.log('出现异常')
					}
				})
			},
			_getreplay(){
				let that = this
				//评论接口
				getreplay(that.songid.length>0?that.songid[that.songidIndex]:that.searchSongid,res=>{
					if(res.data.code == ERROR_OK){
						let comment = res.data
						
						//拿到的评论有双斜杠\\n  需要转义为\n
						let rootcommentcontent =  comment.hot_comment.commentlist[0].rootcommentcontent
						comment.hot_comment.commentlist[0].rootcommentcontent = rootcommentcontent.replace(/\\n/g,"\n")
						that.comment = comment
					}
				})
			},
			_getradiosonglist(){
				console.log('歌曲播放完 重新加载20条')
				//所有音频播放完才执行这个重新获取刷新页面拿到20条url  判断播放完判断音频下标和播放完成才能执行这里
				let that = this
				getradiosonglist(res=>{
					console.log(res)
					if(res.data.code == 0){
						let data = res.data.data
						let dataId = []
						let mid = []
						let getLyricmid = []
						for(let i in data){
							dataId.push(data[i].id)
							mid.push(data[i].album.mid)
							getLyricmid.push(data[i].mid)
						}
						// 判断数组是否有值
						if(dataId.length>0 && mid.length>0){
							that.$router.push({
								path:'/playsong',
								query:{
									songid:dataId.toString(),
									mid:mid.toString(),
									getLyricmid:getLyricmid.toString()
								}
							})
							that.$router.go(0)
						}else{
							console.log("参数错误")
						}
					}
				})
			},
			//获取音频函数
			_getaudiovkey(){
				let that = this
				that.$Indicator.open({
					spinnerType:'triple-bounce'
				})
				
				if(that.songmid != ""){
					getaudiovkey(that.songmid,res=>{
						//歌词滚动
						that.bscroll()
						that.purl = "http://dl.stream.qqmusic.qq.com/"+res.data.req_0.data.midurlinfo[0].purl
						if(res.data.req_0.data.midurlinfo[0].purl && res.data.req_0.data.midurlinfo[0].purl != ""){
						 	setTimeout(()=>{
						 		that.$refs.myaudio.play()//音频开始播放
								that.playpause = true
								that.$Indicator.close()
						 	},1000)
							clearTimeout(that.stop)
							let arrLyric = that.arrLyric
							let iValue = that.iValue

							let lyricUl = $('.lyricUl li')

							that.transform = 116
							console.log(that.arrLyric)
							that.stop = setInterval(()=>{
								//判断音频暂停再播放以后才能进入if
								if(that.playpause){
									//判断歌词滚动完成则不允许进入	
									if(iValue<arrLyric.length){
										//判断播放时间到了就往上滚动
										if(that.$refs.myaudio.currentTime>arrLyric[iValue].time){
											$(lyricUl).removeClass('current')
											$(lyricUl).eq(iValue).addClass('current')
											that.transform = that.transform-$(lyricUl).eq(iValue).outerHeight(true)
											++iValue
											// console.log(that.transform)
											if(!that.scrolling){
												// that.transform3d = {
												//     'transform': `translate3d(0px, ${that.transform}px, 0px)`
												// }
												that.scroll.scrollTo(0, that.transform, 0.3, "easing")
											}
										}
									}	
									if(that.$refs.myaudio.paused){
										that.playpause = false
										that.$refs.myaudio.pause()
									}
									//判断播放完成
									if(that.$refs.myaudio.ended){
										console.log('本集播放完成')
										that.playpause = false
										that.transform = 0

										that.$refs.myaudio.pause()
										clearInterval(that.stop) //播放完成 清除定时器

										//重新播放当前歌曲
										that._getaudiovkey()
										
									}
								}
							})
						}else{
							that.$Toast('无法获取播放地址 自动切换下一首')
							that.$Indicator.close()
							// 判断获取下一首
							that.songidIndex = that.songidIndex+1
							that._getmusicu()//视频接口
							that._getreplay()//评论接口
							that._getaudiovkey()//音频接口
						}
					})
				}else{	
					// 获取音频  首先获取参数songmid
					getAlbum(that.mid[that.songidIndex],res=>{
						console.log("音频拿到")
						console.log(res)
						if(res.data.code == ERROR_OK){
							let list = res.data.data.list
							for(let index in list){
								if(list[index].songmid == that.getLyricmid[that.songidIndex]){
									console.log("正常拿到播放")
									getaudiovkey(that.getLyricmid[that.songidIndex],res=>{
										//歌词滚动
										that.bscroll()
										that.purl = "http://dl.stream.qqmusic.qq.com/"+res.data.req_0.data.midurlinfo[0].purl

										if(res.data.req_0.data.midurlinfo[0].purl && res.data.req_0.data.midurlinfo[0].purl != ""){

										 	setTimeout(()=>{
										 		that.$refs.myaudio.play()//音频开始播放
												that.playpause = true
												that.$Indicator.close()
										 	},1000)
											clearTimeout(that.stop)

											let arrLyric = that.arrLyric
											let iValue = that.iValue

											let lyricUl = $('.lyricUl li')

											that.transform = 116
											that.stop = setInterval(()=>{
												//判断音频暂停再播放以后才能进入if
												if(that.playpause){
													//判断歌词滚动完成则不允许进入	
													if(iValue<arrLyric.length){
														//判断播放时间到了就往上滚动
														if(that.$refs.myaudio.currentTime>arrLyric[iValue].time){
															$(lyricUl).removeClass('current')
															$(lyricUl).eq(iValue).addClass('current')
															that.transform = that.transform-$(lyricUl).eq(iValue).outerHeight(true)
															++iValue
															// console.log(that.transform)
															if(!that.scrolling){
																// that.transform3d = {
																//     'transform': `translate3d(0px, ${that.transform}px, 0px)`
																// }
																that.scroll.scrollTo(0, that.transform, 0.3, "easing")
															}
														}
													}	
													if(that.$refs.myaudio.paused){
														that.playpause = false
														that.$refs.myaudio.pause()
													}
													//判断播放完成
													if(that.$refs.myaudio.ended){
														console.log('本集播放完成')
														that.playpause = false
														that.$refs.myaudio.pause()
														clearInterval(that.stop) //播放完成 清除定时器

														if(that.songidIndex < that.songid.length-1){
															// 判断获取下一首
															that.songidIndex = that.songidIndex+1
															that._getmusicu()//视频接口
															that._getreplay()//评论接口
															that._getaudiovkey()//音频接口
														}else{
															//加载的20首播放完成  重新刷新页面获取20首
															that._getradiosonglist()
														}
														
													}
												}
											})
										}else{
											that.$Toast('无法获取播放地址 自动切换下一首')
											that.$Indicator.close()
											// 判断获取下一首
											that.songidIndex = that.songidIndex+1
											that._getmusicu()//视频接口
											that._getreplay()//评论接口
											that._getaudiovkey()//音频接口
										}
									})
								}
							}
						}
					})
				}
			},
			//获取视频播放源（vkey）
			playVideo(thisVideo,vid){
				let that = this
				that.$Indicator.open({
					spinnerType:'triple-bounce'
				})
				getplaysongVideoUrl(vid,res=>{
					let data = JSON.parse(res.data.substring(res.data.indexOf('(')+1,res.data.length-1))
					that.$Indicator.close()
					if(data.code == ERROR_OK){
						console.log(data.getMVUrl.data[vid].mp4[2].freeflow_url[0])
						let videofm = $(thisVideo.target).parent('.video_fm')
						$(videofm).html("<video style='width:90%;' src="+data.getMVUrl.data[vid].mp4[2].freeflow_url[0]+" controls autoplay></video>")

						that.$refs.myaudio.pause()
						that.playpause = false
						
						// console.log($(videofm).find('video').paused)
					}
				})
			},
			clickView(){
				let that = this
				that.$Toast('请前往QQ音乐APP体验更多功能')
			},
			noOpen(){
				let that = this
				that.$Toast('请前往QQ音乐APP体验更多功能')
			},
			transformFun(){
				let that = this
				that.album = !that.album 
			},
			//播放暂停
			playpauseFun(){
				let that = this
				let myAudio = that.$refs.myaudio
				let iValue = that.iValue

				//判断是否播放完成  
				if(that.$refs.myaudio.ended){
					that.transform = 0
					that._getaudiovkey()
					// that.clickPlay(that.recodemid,that.recodeflag,that.recodetitle,that.recodemusicid)
					that.playpause = true
				}else{
					if(!myAudio.paused){
						that.playpause = false
						myAudio.pause()
					}else{
						that.playpause = true
						myAudio.play()
					}
				}
			},
			time(now){
				let riqi = new Date(parseInt(now+'000'))
				var year=riqi.getFullYear(); 
				var month=riqi.getMonth()+1; 
				var date=riqi.getDate(); 
				var hour=riqi.getHours(); 
				var minute=riqi.getMinutes(); 
				var second=riqi.getSeconds(); 
				return year+"-"+month+"-"+date+" "+hour+":"+minute+":"+second; 
			},
			//时间转秒函数(用于歌词时间转秒)
			timeTmm(arrTime){
				let tempArrTime = []
				for(let i in arrTime){
					let splitArr = arrTime[i].match(/\d+/ig)
					
					let storage =parseFloat(parseFloat(splitArr[0])*60000+parseInt(splitArr[1]+splitArr[2]+'0'))/1000

					tempArrTime.push(storage)
				}
				return tempArrTime
			}
		}
	}
</script>
<style scoped>

.fade-abosolute-enter,.fade-abosolute-leave-active{
	opacity: 0
}
.fade-abosolute-enter-active,.fade-abosolute-leave-active{
	transition: all 1s
}
.back{
	position: absolute;
	top: 10px;
	left: 6px;
	z-index: 50;
}
.icon-back{
	display: block;
	padding: 10px;
}
.album_div{
	position:absolute;
	top:78px;
	text-align: center;
	width:100%;
	z-index:10;
	transition:all 1s ease 0;
}
.album_img{
	width:200px;
	height:200px;
}
.current{
	color:#31c27c!important;
}
.bscroll{
	width:100%;
	overflow:hidden;
}
.vipicon_icon{
    width: 25px;
    height: 22px;
}
.cover_play{
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 2;
    width: 50px;
    height: 50px;
    margin-top:-42px;
    margin-left:-25px;
    background-repeat: no-repeat;
    background-size:100%;
    background-position: left;
}
.video_detail{
	width:90%;
	margin:5px auto 15px auto;
	text-align: left;
}
.video_detail p{
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color:rgb(140,140,140);
    font-size:12px;
}
.video_detail h4{
    font-size: 13px;
    margin-bottom:5px;
    color: #000;
}
.video_con{
	text-align: center;
	position:relative;
}
.video_con img{
	width:90%;
}
.replay_content{
	white-space: pre-wrap;
	font-size:13px;
	color:rgb(50,50,50);
	padding:5px 20px;
	line-height: 20px
}
.mt_top_right{
	float:right;
	color:rgb(110,110,110);
	font-style: normal;
	font-size:12px;
}
.mt_top_left{
	float:left;
	padding-left:10px;
}
.mt_top_left h4{
	font-size:14px;
	color:rgb(110,110,110);
}
.mt_top_left time{
	font-size:12px;
	color:rgb(110,110,110);
}
.mt_top .mt_img{
	width:30px;
	height:30px;
	border-radius:50%;
	overflow:hidden;
	float:left;
}
.mt_top{
	padding:10px;
}
.mt_top:after{
	content:"";
	display:block;
	clear:both;
}
.zhuanji_ul{
	margin:0 -1px;
	font-size:0;
	padding:0px 20px;
}
.zhuanji_ul li{
	display:inline-block;
	width:33.33333%;
	overflow:hidden;
	margin-top:15px;
	margin-bottom:15px;
}
.zj_div{
	margin:0 1px;
}
.zhuanji_ul .zhuanji_img{
	width:100%;
	height:100%;
}
.qui_equal_col__desc{
	margin: 0 8px;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	font-size: 12px;
	margin-top:7px;
}
.qui_equal_col__tit{
	margin: 0 8px;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	font-size: 12px;
	margin-top: 5px;
	color: #000;
	height:17px;
}
.qui_tit__text{
	margin-left: 5px;
	overflow: hidden;
	white-space: nowrap;
	letter-spacing: 5px;
	font-size: 16px;
	color: #000;
}
.zuixin_zhuanji{
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-box-pack: center;
	-webkit-box-align: center;
	height: 55px;
	padding: 0 40px;
	overflow: hidden;
	text-align: center;
}
.gt{
	float:right;
	margin-top:18px;
}
.name_dec{
	white-space: nowrap;
	width:100%;
	text-overflow: ellipsis;
	overflow:hidden;
	padding-left:5px;
	margin-top:10px;
}
.name_dec .name{
	font-size:14px;
}
.name_dec .dec{
	white-space: nowrap;
	width:100%;
	text-overflow: ellipsis;
	overflow:hidden;
	font-size:12px;
	margin-top:6px;
}
.cnxh_ul li{
	display:flex;
	border-bottom:1px solid rgb(240,240,240);
	padding:0px 20px 0px 0px;
	margin:0px 0px 2px 20px;
}
.cnxh_ul .cnxh_img{
	width:55px;
	min-width:55px;
	height:55px;
	min-height:55px;
}
.cnxht{
	/*padding:20px;*/
}
.title{
	text-align: center;
	padding:20px 0px;
	font-size:16px;
}
.free_download{
	display: block;
	width: 200px;
	height: 40px;
	line-height: 40px;
	margin: 10px auto;
	letter-spacing: 1px;
	text-align: center;
	font-size: 18px;
	border-radius: 30px;
	color: #fff;
	background: #31c27c;
	border:none;
  outline:none;
}
.menu_icon{
	font-weight: bold;
	font-size:20px;
}
.control_button span{
	display:inline-block;
	padding:10px;
	margin:0px 18px;
	border:1px solid rgb(200,200,200);
	border-radius:50%;
	font-size:17px;
}
.control_button{
	text-align:center;
	padding:20px 0px;
	margin-top: -10px;
}
.viewmorelyric{
	text-align: center;
}
.viewmorelyric .view{
	display:inline-block;
	height: 20px;
	padding-top: 15px;
	font-size: 13px;
	color: #000;
}
.viewmorelyric .view i{
	font-size:13px;
}
.lyric{
	height:200px;
	overflow:hidden;
	text-align: center;
	-webkit-mask:-webkit-linear-gradient(top,rgba(0,0,0,0),#fff 25%,#fff 75%,rgba(0,0,0,0));
}
.lyricUl{
	transition:transform 0.3s ease-out 0s;
	transition-duration:0.6s!important;

}
.lyric li{
	padding:8px 35px;
	font-size:15px;
	color:rgba(0,0,0,.9);
}
.main{
	position:relative;
	height:440px;
	overflow:hidden;
}
.bg{
	position:absolute;
	z-index: 1;
	top:0;
	left:0;
	right:0;
	bottom: 0;
}
.bg img{
	width:100%;
}
.content{
	position:absolute;
	z-index: 10;
	top:0;
	left:0;
	right:0;
	bottom: 0;
	background:rgba(255,255,255,.9);
}
.center_content{
	text-align: center;
	padding:20px;
}
.song_name{
	display: block;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	font-size:17px;
	font-weight: 400;
	color: #000;
}
.song_author{
	color:rgb(110,110,110);
	font-size:14px;
	margin-top:10px;
}
</style>
