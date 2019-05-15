<template>
	<div id='gedanlist'>
		<div v-show='false' ref="zhuanyi">
			<!-- 用于转义 不显示 -->
		</div>
		<div class="back" @click="back">
			<i class="icon-back iconfont">
				<img src="@/assets/back.png" alt="">
			</i>
		</div>
		<audio ref='myaudio' v-show='false' :src='playUrl !=""?playUrl:""'></audio>

		<div class="songlist_top" ref='songlisttop'>
			<div class="back_" v-if='cdlist.logo && cdlist.logo!=""' :style='"background:url("+cdlist.logo+") center"'>
				
			</div>
			<div class="back_content">
				<div class="tx_title_ clear">
					<img class="tx_ left" :src="cdlist.logo" alt="">
					<div class="right_ left">
						<h2 class="title_">{{cdlist.dissname}}</h2>
						<p class="clear url_name_con"><img class="min_tx left" v-if='cdlist.headurl' :src="cdlist.headurl"><span class="person_name left">{{cdlist.nickname}}</span></p>
						<p class="play_num">播放量：{{tranFormat(cdlist.visitnum)}}</p>
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
					<span class="songlist_title_left left">歌曲&nbsp;共{{cdlist.total_song_num}}首</span>
					<span class="songlist_title_right right" @click='favorites'>收藏<i class="iconfont icon_fa">&#xe60c;</i></span>
				</h2>
				<div class="gedan_list">
					<li v-for='songlist of cdlist.songlist' :key='songlist.mid' class="song_list_item" :class='songlist.pay.pay_down == 0 && songlist.action.alert == 0 && songlist.action.msgpay == 0?"ccc":""' @click='clickPlay(songlist.mid,songlist.pay.pay_down == 0 && songlist.action.alert == 0 && songlist.action.msgpay == 0,songlist.title,songlist.id)'>
				<!-- <li v-for='songlist of cdlist.songlist' :key='songlist.mid' class="song_list_item" @click='clickPlay(songlist.mid)'> -->
						<h2 class="song_name">{{songlist.title}}</h2>
						<p class='song_dec'>
							<img class="vip_icon" v-if='songlist.pay.pay_play == 1' :src="iconVip" alt="">
							<span v-for='item of songlist.singer' :key='item.id'>{{item.name}}</span><span v-if='songlist.album.name && songlist.album.name != ""'>·</span><span>{{songlist.album.name}}</span>
						</p>
					</li>
				</div>	
				<div class='check_more' v-if='noLoading == 0'>
					<span @click.once='clickLoadMoreData'>点击加载更多歌曲</span>
				</div>
				<div class="loading_con" v-if='noLoading == 1'>
					<mt-spinner type="triple-bounce"></mt-spinner>
				</div>
				<div class='check_more' v-if='noLoading == 2'>
					<span>没有更多数据啦！</span>
				</div>
				<div class="qui_tit">
					<h1 class="qui_tit__text">歌单简介</h1>
				</div>
				<div>
					<p class="jianjie_p" v-html='cdlist.desc'></p>
				</div>
			</ul>
		</div>
	</div>
</template>
<script>
	import {getSongList,getvkey,getLyric,ERROR_OK} from '@/api/getIndex'
	import BScroll from 'better-scroll'
	import $ from 'jquery'

	export default{
		name:'gedanlist',
		data(){
			return {
				cdlist:{},
				disstid:'', //歌单列表disstid
				logo:{},
				noLoading:0,
				song_begin:0,//一次加载15条  15叠加
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
			_getSongList(){
				let that = this
				getSongList(that.disstid,that.song_begin,res=>{
					if(res.data.code == ERROR_OK){
						that.cdlist = res.data.cdlist[0]
						//获取mid  存入songmid变量
						let songlist = res.data.cdlist[0].songlist
						let tempSongmid = [] //临时存储songmid
						for(let i in songlist){
							tempSongmid.push(songlist[i].mid)
						}
						that.songmid = tempSongmid
						//首次加载  获取key
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
				let firstsonglist = that.cdlist.songlist[0]
				that.clickPlay(firstsonglist.mid,firstsonglist.pay.pay_down == 0 && firstsonglist.action.alert == 0 && firstsonglist.action.msgpay == 0,firstsonglist.title,firstsonglist.id)
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
					let currentcdlist = that.cdlist.songlist
					for(let i in currentcdlist){
						if(currentcdlist[i].mid == mid){
							that.autoplayIndex = i  
						}
					}
					let midurlinfo = that.midurlinfo
					that.$Indicator.open({
						spinnerType:'triple-bounce'
					})
					for(let i in midurlinfo){
						if(midurlinfo[i].songmid == mid){
							// console.log(midurlinfo[i].purl)
							if(midurlinfo[i].purl && midurlinfo[i].purl != ''){
								that.isCurrentSong = true
								//拿到请求地址和参数
								that.playUrl = `http://183.60.23.28/amobile.music.tc.qq.com/${midurlinfo[i].purl}`;
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
									let autoplayIndex =	parseInt(that.autoplayIndex)+1
									//调用下一首
									that.clickPlay(currentcdlist[autoplayIndex].mid,currentcdlist[autoplayIndex].pay.pay_down == 0 && currentcdlist[autoplayIndex].action.alert == 0 && currentcdlist[autoplayIndex].action.msgpay == 0,currentcdlist[autoplayIndex].title,currentcdlist[autoplayIndex].id)
								}
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
													console.log('本集播放完成')
													that.playpause = false
													that.$refs.myaudio.pause()
													clearInterval(that.stop) //播放完成 清除定时器

													console.log('即将播放下一首')
													//判断是否有下一首
													if(that.autoplayIndex<currentcdlist.length-1){
														let autoplayIndex =	parseInt(that.autoplayIndex)+1
														//调用下一首
														that.clickPlay(currentcdlist[autoplayIndex].mid,currentcdlist[autoplayIndex].pay.pay_down == 0 && currentcdlist[autoplayIndex].action.alert == 0 && currentcdlist[autoplayIndex].action.msgpay == 0,currentcdlist[autoplayIndex].title,currentcdlist[autoplayIndex].id)
													}else{
														that.$Toast({
															message:'歌曲播放完成啦',
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
			clickLoadMoreData(){
				let that = this
				let midurlinfo = that.midurlinfo
				that.noLoading = 1
				that.musicu = true //设置为true则可以加载vkey列表
				let song_begin = that.song_begin+15
				getSongList(that.disstid,song_begin,res=>{
					if(res.data.code == ERROR_OK){
						let oldCdlistr = that.cdlist
						if(res.data.cdlist[0].songlist.length >0 ){
							let newSonglist = res.data.cdlist[0].songlist
							let tempSongmid = [] //临时存储songmid
							for(let i in newSonglist){
								oldCdlistr.songlist.push(newSonglist[i])
								tempSongmid.push(newSonglist[i].mid)
							}
							that.songmid = tempSongmid
							that.cdlist = oldCdlistr
							that.song_begin = song_begin
							that.noLoading = 0


							//加载更多  再次获取vkey
							getvkey(JSON.stringify(that.songmid),res=>{
								if(res.data.code == ERROR_OK){
									let newMidurlinfo = res.data.req_0.data.midurlinfo
									for(let i in newMidurlinfo){
										midurlinfo.push(newMidurlinfo[i])
									}
									that.midurlinfo = midurlinfo
								}
							})
						}else{
							that.noLoading = 2
						}
						
					}
					that.$Indicator.close()
				})
			},
			//时间转秒函数(用于歌词时间转秒)自主开发
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
			},
			favorites(){
				let that = this
				if(that.hint){
					that.hint = false
					this.$Toast('请前往QQ音乐APP体验更多功能')
				}else{
					this.$Toast('请前往QQ音乐APP体验更多功能')
				}
			},
			//人数转换 ==>  万 亿
			tranFormat(num) {
				let newsnum = num + ''
				let numlength = newsnum.length
				let numArr = []
				let newsnum2 = []

				let returnNum = ''
	            if(numlength <= 4){
	            	return newsnum
	            }else if(numlength >=5 && numlength <= 8){
	            	for(let i in newsnum){
	            		numArr.push(newsnum[i])
	            	}
	            	let reverseArr = numArr.reverse()
	            	for(let i in reverseArr){
	            		if(i == 3){
	            			newsnum2.push('.'+reverseArr[i]+'万')
	            		}else if(i >= 4){
	            			newsnum2.push(reverseArr[i])
	            		}
	            	}
	            	let newsnum3 =  newsnum2.reverse()
	            	for(let i in newsnum3){
	            		returnNum += newsnum3[i]
	            	}
	            	return returnNum;
	            }else if(numlength >=9){
	            	for(let i in newsnum){
	            		numArr.push(newsnum[i])
	            	}
	            	let reverseArr = numArr.reverse()
	            	for(let i in reverseArr){
	            		if(i == 7){
	            			newsnum2.push('.'+reverseArr[i]+'亿')
	            		}else if(i >= 8){
	            			newsnum2.push(reverseArr[i])
	            		}
	            	}
	            	let newsnum3 =  newsnum2.reverse()
	            	for(let i in newsnum3){
	            		returnNum += newsnum3[i]
	            	}
	            	return returnNum;
	            }
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
			that.song_begin = 0 //初始化加载数据次数  0-->15-->30
			that.noLoading = 0 //初始化显示加载更多按钮
			that.disstid = that.$route.query.id
			that._getSongList()
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
			that.$Indicator.close()
			that.cdlist = ''
			that.logo = ''
			that.hint = true
			that.$refs.myaudio.pause()
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
	.ccc .song_name,.ccc .song_dec{
		color:rgb(200,200,200);
	}
	.vip_icon{
		height:10px;
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
	.loading_con{
	    padding: 20px;
	    text-align: center;
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
	.check_more{
		display: -webkit-box;
	    -webkit-box-pack: center;
	    -webkit-box-align: center;
	    height: 32px;
	    margin-bottom: 15px;
	    font-size: 14px;
	    color:#777;
	}
	.check_more span{
		padding:10px;
	}
	.song_list_item{
		padding:15px;
		line-height: 21px;
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
	}
	.song_name{
		font-size:16px;
	    display: block;
	    max-width: 100%;
	    overflow: hidden;
	    white-space: nowrap;
	    text-overflow: ellipsis;
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
	.url_name_con{
		width:151px;
		display:flex;
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
	    margin-top: 1px;
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
