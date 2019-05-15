<template>
	<div id='toplist'>
		<div v-show='false' ref="zhuanyi">
			<!-- 用于转义 不显示 -->
		</div>
		<div class="back" @click="back">
			<i class="icon-back iconfont">
				<img src="@/assets/back.png" alt="">
			</i>
		</div>
		<audio ref='myaudio' v-show='false' :src='playUrl !=""?playUrl:""'></audio>
		<div class="songlist_top" ref='songlisttop' v-if='data != {}'>
			<div class="back_" v-if='data.topinfo && data.topinfo.pic_album != ""'  :style='"background:url("+data.topinfo.pic_album+") center"'>
				
			</div>
			<div class="back_content">
				<div class="tx_title_ clear" v-if='data.topinfo'>
					<img class="tx_ left" :src="data.topinfo.pic_album" alt="">
					<div class="right_ left">
						<h2 class="title_">{{data.topinfo.ListName}}</h2>
						<p class="clear">
							<span class="person_name left" v-if='data.day_of_year != ""'>第{{data.day_of_year}}天</span>
							<span class="person_name left" v-else>第{{zhou}}周</span>
						</p>
						<p class="play_num">{{data.update_time}}&nbsp;更新</p>
					</div>
				</div>
				<div class='play_btn' v-if='!playing'>
					<button class="play_all" type="button" @click='playAll'><i class="iconfont icon_pause">&#xe61e;</i>播放全部</button>
				</div>
				<div class='play_con' v-else>
					<div class="circle_" @click='playpauseFun'>
						<span class="iconfont play" v-if='playpause'>&#xe6a5;</span>
						<span class="iconfont pause" v-else>&#xe618;</span>
					</div>
					<div class="song_name_lari">
						<h3 class="song_na">{{title}}</h3>
						<div class="lari_height">
							<div class="song_lari" :style='[transform3d,transition]'>
								<p v-for='(lyric,index) of arrLyric' :key='index'>{{lyric.lyric}}</p>
							</div>
						</div>
					</div>
					<span class="iconfont download_icon" @click='downloadFun'>&#xe6e9;</span>
				</div>	
			</div>
		</div>
		<div class="songlist_content bscroll" ref='bscroll'>
			<ul class="song_list">
				<h2 class="songlist_title clear">
					<span class="songlist_title_left left">排行榜&nbsp;共{{data.cur_song_num}}首</span>
				</h2>
				<div class="gedan_list">
					<!-- 由于qq音乐传过来的id重复了 所以此处只能使用下标(index)  此处只是获取数据  没有影响 -->
					<li v-for='(songlistItem,index) of data.songlist' :key='index' class="song_list_item" @click='clickPlay(songlistItem.data.songmid,false,songlistItem.data.songname,songlistItem.data.songid)'>
						<span class="num" :class='index>2?"":"red"'>{{index+1}}</span>
						<div class="song_name_dec">
							<h2 class="song_name">{{songlistItem.data.songname}}</h2>
							<p class='song_dec'>
								<img class="vip_icon" v-if='songlistItem.data.pay.payplay == 1' :src="iconVip" alt="">
								<span v-for='(item,index) of songlistItem.data.singer' :key='item.id'>{{item.name}}</span><span v-if='songlistItem.data.albumdesc && songlistItem.data.albumdesc !=""'>·</span><span>{{songlistItem.data.albumdesc}}</span>
							</p>
						</div>
					</li>
				</div>
				<div class="qui_tit">
					<h1 class="qui_tit__text">简介</h1>
				</div>
				<div v-if='data.topinfo'>
					<p class="jianjie_p" v-html='data.topinfo.info'></p>
				</div>
			</ul>
		</div>
	</div>
</template>
<script>
	import {getToplist,getvkey,getLyric,ERROR_OK} from '@/api/getIndex'
	import BScroll from 'better-scroll'
	import $ from 'jquery'

	export default{
		name:'toplist',
		data(){
			return{
				topid:'',
				data:{},
				zhou:'',//周数
				developer:false,
				vkey:'',//动态唯一标识（用来拿取视频）
				filename:'',//音频资源路径（用来拿取视频）
				playUrl:'',
				musicu:true,//允许操作musicu文件
				midurlinfo:[],//没错，vkey就在里面,每次加载歌曲进行叠加
				songmid:[],//用于存储songmid  也就是发送到后端获取到vkey必要参数的  vkey才能获取到音频
				iconVip:require('@/assets/icon_vip.png'),//vip图标
				hint:true,
				playing:false,
				playpause:false,
				title:'',//歌曲名称
				lyric:'',//歌词
				arrLyric:'',
				stop:null, //歌词滚动的定时器
				stop2:null, //用于监听歌曲播放完成停止播放的定时器
				iValue:0,	//记录下标
				transform:28, //记录滚动距离
				transform3d:{
				    'transform': 'translate3d(0px, 28px, 0px)'
				},//歌词滚动样式
				transition:{
					'transition':'all 0 ease 0'
				},
				recodemid:0,
				recodeflag:0,
				recodetitle:0,
				recodemusicid:0,
				autoplayIndex:0,//自动"播放全部"按钮下标
				isCurrentSong:true,
			}
		},
		methods:{
			back() {
				this.$router.back()
			},
			_getTopList(){
				let that = this
				getToplist(that.topid,res=>{
					if(res.data.code == ERROR_OK){
						that.data = res.data
						// 如果没有天数则获取周数
						let arrDate = res.data.date.split('_')
						that.zhou = arrDate[1]

						//获取vkey接口
						let songlist = res.data.songlist
						let tempSongmid = [] //临时存储songmid
						for(let i in songlist){
							tempSongmid.push(songlist[i].data.songmid)
						}
						that.songmid = tempSongmid
						getvkey(JSON.stringify(that.songmid),res=>{
							if(res.data.code == ERROR_OK){
								that.midurlinfo = res.data.req_0.data.midurlinfo
							}
						})
						that.$Indicator.close()
					}
				})
			},
			//播放全部
			playAll(){
				let that = this
				// 获得第一首
				let currentcdlist = that.data.songlist
				that.clickPlay(currentcdlist[0].data.songmid,false,currentcdlist[0].data.songname,currentcdlist[0].data.songid)
			},
			/*
				mid:匹配正确则拿到当前对象数据中的purl，purl也就是播放源地址  拿到以后就可以拼接使用
				flag：用于控制歌曲是否能允许播放
				title:歌曲名称
				musicid：用来获取歌词
			*/
			clickPlay(mid,flag,title,musicid){
				let that = this
				if(!flag){
					// 拿到播放第几首的下标
					let currentcdlist = that.data.songlist

					for(let i in currentcdlist){
						if(currentcdlist[i].data.songmid == mid){
							that.autoplayIndex = i  
						}
					}
					let midurlinfo = that.midurlinfo
					that.$Indicator.open({
						spinnerType:'triple-bounce'
					})
					for(let i in midurlinfo){
						if(midurlinfo[i].songmid == mid){
							if(midurlinfo[i].purl && midurlinfo[i].purl != ''){
								that.isCurrentSong = true
								//拿到请求地址和参数
								that.playUrl = `http://183.60.23.28/amobile.music.tc.qq.com/${midurlinfo[i].purl}`;
								break;
							}else{
								that.isCurrentSong = false
								that.$Indicator.close()
								that.$Toast({
									message:'付费歌曲,自动播放下一首',
									duration:3000
								})
								//播放下一首
								//判断是否有下一首
								if(that.autoplayIndex<currentcdlist.length-1){
									that.autoplayIndex	= parseInt(that.autoplayIndex)+1
									//调用下一首
									that.clickPlay(currentcdlist[that.autoplayIndex].data.songmid,false,currentcdlist[that.autoplayIndex].data.songname,currentcdlist[that.autoplayIndex].data.songid)
								}
								return
							}
						}
					}
					//判断播放源存在								
					if(that.playUrl != '' && that.isCurrentSong){
						// 调用接口拿到歌词
						getLyric(musicid,res=>{
							if(res.data && res.data != undefined){
								//成功拿到的歌词数据（res）有函数包着 只能用字符串截取把函数去掉  并转成json格式  JSON.parse()
								let data = JSON.parse(res.data.substring(res.data.indexOf('(')+1,res.data.length-1))
								//拿到数据 开始判断data.code状态是否等于ERROR_OK
								if(data.code == ERROR_OK){
									clearInterval(that.stop)
									that.playpause = false  //显示暂停，重新选曲

									let li = $('.gedan_list>li')
									$(li).removeClass('current')

									$(li).eq(that.autoplayIndex).addClass('current')


									that.transition = {
										'transition':'all 0 ease 0'
									}
									that.transform = 28 //记录滚动距离

									//我做了限制  歌词拿到 才能播放
									// 记录下来，为了播放完成以后重新播放使用
									that.recodemid = mid
									that.recodeflag = flag
									that.recodetitle = title
									that.recodemusicid = musicid


									//拿到的歌词时间用HTML标签转义 
									that.$refs.zhuanyi.innerHTML = data.lyric
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

									//设置播放滚动特效
									that.transition = {
										'transition':'transform 0.3s ease-out 0s'
									}

									let iValue = that.iValue = 0	//记录下标
									
										
									that.title = title //当前点击的歌曲名称
									that.$refs.myaudio.play()//音频开始播放
									that.playing = true //显示播放容器
									that.playpause = true //显示播放按钮
									that.$Indicator.close()
									let lyrictimeLength = lyrictime.length //获取歌词数组的长度
									//判断音频播放以后执行
									if(!that.$refs.myaudio.paused){
										that.stop = setInterval(()=>{
											//判断音频暂停再播放以后才能进入if
											if(that.playpause){		
												//判断歌词滚动完成则不允许进入	
												if(iValue<lyrictimeLength){
													//判断播放时间到了就往上滚动
													if(that.$refs.myaudio.currentTime>lyrictime[iValue].time){
														++iValue
														that.transform = that.transform-28
														// console.log(that.transform)
														that.transform3d = {
														    'transform': `translate3d(0px, ${that.transform}px, 0px)`
														}
													}
												}	
												//判断播放完成就播放下一集
												if(that.$refs.myaudio.ended){
													console.log('当前歌曲播放完成')
													that.playpause = false
													that.$refs.myaudio.pause()
													clearInterval(that.stop) //播放完成 清除定时器

													console.log('即将播放下一首')
													//判断是否有下一首
													if(that.autoplayIndex<currentcdlist.length-1){
														let autoplayIndex =	parseInt(that.autoplayIndex)+1
														//调用下一首
														console.log()
														that.clickPlay(currentcdlist[autoplayIndex].data.songmid,false,currentcdlist[autoplayIndex].data.songname,currentcdlist[autoplayIndex].data.songid)
													}else{
														that.$Toast({
															message:'歌曲播放完成',
															duration:3500
														})
													}
												}
											}
										},20)
									}
								}
							}
						})
					}
					
					setTimeout(()=>{
						that.$Indicator.close()
					},3000)
				}else{
					that.$Toast({
						message:'此歌需要登录后才能播放，请前往QQ音乐APP体验更多功能',
						duration:3500
					})
				}
				
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
			},
			//播放暂停
			playpauseFun(){
				let that = this
				let myAudio = that.$refs.myaudio
				let iValue = that.iValue

				//判断是否播放完成  
				if(that.$refs.myaudio.ended){
					that.transform = 0
					that.clickPlay(that.recodemid,that.recodeflag,that.recodetitle,that.recodemusicid)
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
			downloadFun(){
				this.$Toast('没有下载权限')
			}
		},
		activated(){
			let that = this

			that.playUrl = ''
			that.playing = false
			that.playpause = false
			that.$Indicator.open({
				spinnerType:'triple-bounce'
			})
			that.topid = that.$route.query.id
			that._getTopList()
			that.developer = false
			that.$nextTick(() => {
				// setTimeout(()=>{
					// 初始化better-scroll滚动
					that.scroll = new BScroll(that.$refs.bscroll, {
	                    click: true,
	                    scrollY: true,
	                    probeType: 1,
	                    bounce:true,
	                    pullUpLoad:{
	                      	threshold: 0, // 当上拉到超过底部 0px 时，                    
	                  	}
	                })
					// console.log(document.body.clientHeight)
					// console.log(that.$refs.songlisttop.clientHeight)
	                that.$refs.bscroll.style.height = (document.body.clientHeight - that.$refs.songlisttop.clientHeight)+'px'
	                that.scroll.refresh()
	                this.scroll.on('scroll', (pos) => {
	                    if(pos.y>50){
	                        that.developer = true
	                    }else{
	                        that.developer = false
	                    }
	                })
				// },1000)
			})
		},
		deactivated(){
			let that = this
			that.data = {}
			that.$Indicator.close()
			that.hint = true
			that.$refs.myaudio.pause()
			clearInterval(that.stop)
			clearInterval(that.stop2)
		}
	}
</script>
<style scoped>
	.current .song_name,.current .song_dec{
		color:#31c27c!important;
	}
	.lari_height{
		height:25px;
		overflow:hidden;
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
	.song_lari{

	}
	.song_name_lari{
		color:#fff;
		width:100%;
		padding:9px;
		font-size:14px;
		max-width:70%;
		white-space: nowrap;
	    text-overflow: ellipsis;
    	overflow: hidden;
	}
	.song_name_lari .song_lari p {
	    min-height: 28px;
	    max-height: 28px;
	    line-height: 28px;
	    white-space: nowrap;
	    text-overflow: ellipsis;
    	overflow: hidden;
	}
	.song_name_lari .song_na{
		white-space: nowrap;
		text-overflow:ellipsis;
		overflow:hidden;
		display: block;
		padding-bottom:7px;
	}
	.circle_ .pause{
		font-size:22px;
		margin-left:5px;
	}
	.circle_ .play{
		font-size:34px;
	}
	.download_icon{
		color: #31c27c;
	    font-size: 25px;
	    line-height: 54px;
	    min-width: 38px;
	    text-align: center;
	}
	.circle_{
		width:46px;
		min-width:46px;
		height:46px;
		min-height:46px;
		border-radius:50%;
		border:2px solid #31c27c;
		text-align: center;
		line-height:46px;
		color:#31c27c;
		font-weight: bolder;
	}
	.play_con{
		margin-top: -5px;
		padding:15px 20px;
		display:flex;
	}
	.jianjie_p{
	    margin: 0 16px 20px;
	    overflow: hidden;
	    text-align: justify;
	    word-wrap: break-word;
	    font-size: 14px;
	    color:#777;
	    line-height:19px;
	    white-space: pre-wrap;
	}
	.qui_tit__text{
	    margin-left: 5px;
	    overflow: hidden;
	    line-height: 1.2;
	    white-space: nowrap;
	    letter-spacing: 5px;
	    font-size: 18px;
	    color: #000;
	}
	.qui_tit{
	    position: relative;
	    display: -webkit-box;
	    -webkit-box-orient: vertical;
	    -webkit-box-pack: center;
	    -webkit-box-align: center;
	    height: 55px;
	    padding: 0 40px;
	    overflow: hidden;
	    text-align: center;
	}
	.developer_person{
		position:absolute;
		top:30;
		left:0;
		right:0;
		text-align: center;
		height:50px;
		line-height:50px;
		color:rgb(190,190,190);
		font-size:13px;
	}
	.bscroll{
		width:100%;
		overflow:hidden;
	}
	.vip_icon{
		height:10px;
	}

	.song_list_item{
		padding:15px;
		line-height:21px;
		display:flex;
		overflow:hidden;
	}
	.song_list_item .num{
		color:#777;
	    display: inline-block;
	    margin-right: 14px;
	    line-height: 44px;
	}
	.song_list_item .red{
		color:#FF400B!important;
	}
	.song_dec{
		font-size:13px;
		margin-top:2px;
	    display: block;
	    max-width: 100%;
	    overflow: hidden;
	    white-space: nowrap;
	    text-overflow: ellipsis;
	    color:#777;
	    width:95%;
	}
	.song_name{
		font-size:16px;
	    display: block;
	    max-width: 96%;
	    overflow: hidden;
	    white-space: nowrap;
	    text-overflow: ellipsis;
	}
	.song_name_dec{
		width:100%;
	}
	.songlist_title{
		font-size:14px;
		padding:15px;
	}
	.songlist_title_left{
		color:#777;
	}
	.songlist_title_right{
		color:#31c27c;
	}
	.icon_fa{
		margin-left:10px;
	}
	.play_num{
		color:#fff;
		font-size:13px;
	}
	.songlist_top{
		padding:20px;
		background:rgba(0,0,0,.7);
		position:relative;
		min-height:200px;
		overflow:hidden;
	}
	.back_{
		width:100%;
		height:100%;
		position:absolute;
		top:0;
		left:0;
		right:0;
		bottom:0;
		filter:blur(20px);
		z-index:1;
	}
	.back_content{
		width:100%;
		height:100%;
		position:absolute;
		top:0;
		left:0;
		right:0;
		bottom:0;
		z-index:10;
		background: rgba(0,0,0,.3);
	}
	.tx_{
	    position: relative;
	    width: 115px;
	    height:115px;
	    min-height:115px;
	    min-width:115px;
	    margin-top: 25px;
	    margin-right: 10px;
	    margin-left: 35px;
	    overflow: hidden;
	}
	.right_{
		margin-top:30px;
	}
	.right_ .title_{
	    display: -webkit-box;
	    -webkit-box-orient: vertical;
	    -webkit-line-clamp: 2;
	    max-height: 47px;
	    min-height: 47px;
	    line-height: 1.3;
	    overflow: hidden;
	    font-size: 18px;
	    color:#fff;
	}
	.min_tx{
		display: inline-block;
	    width: 24px;
	    height: 24px;
	    margin-right: 8px;
	    border-radius: 24px;
	    margin-top:10px;
	}
	.play_num{
	    display: -webkit-box;
	    -webkit-box-orient: vertical;
	    -webkit-line-clamp: 2;
	    max-height: 36px;
	    overflow: hidden;
	    margin-top: 8px;
	}
	.person_name{
		display: inline-block;
	    overflow: hidden;
	    white-space: nowrap;
	    text-overflow: ellipsis;
	    font-size: 14px;
	    color: #fff;
	    margin-top:15px;
	}
	.tx_title_{
		display:flex;
		margin-top:30px;
		margin-left:20px;
		width:85%;
	}
	.play_all{
		display: -webkit-box;
	    -webkit-box-pack: center;
	    -webkit-box-align: center;
	    min-width: 130px;
	    padding: 0 40px;
	    height: 40px;
	    overflow: hidden;
	    text-align: center;
	    font-size: 16px;
	    color: #fff;
	    border-radius: 20px;
	    background: #31c27c;
	    border:none;
        outline: none;
	}
	.play_btn{
		display:flex;
		justify-content: center;
		margin-top:15px;
	}
	.icon_pause{
		margin-right:5px;
	}
</style>
