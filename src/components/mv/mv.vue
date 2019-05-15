<template>
	<div id="mv">
		<div class="back" @click="back">
            <i class="icon-back iconfont">
                <img src="@/assets/back.png" alt="">
            </i>
        </div>
        
		<video :poster="getMVInfo.cover_pic_medium!=undefined?getMVInfo.cover_pic_medium:''" controls :src="getMVUrl != ''?getMVUrl:''" width='100%'></video>
		
		<!-- 选项卡 -->
		<div class="navbar">
			<div class="navbar_item" @click='details'>
				<span :class="toogle == 0?'select':''">详情</span>
			</div>
			<div class="navbar_item" @click='replay'>
				<span :class="toogle == 1?'select':''">评论 <span class="replay_num" v-if="mvreplay!=''">{{mvreplay.comment.commenttotal}}</span></span>
			</div>
		</div>
		<!-- end 选项卡 -->

		<!-- 详情 -->
		<div class="details" v-show="toogle == 0">
			<div class="mv_info__hd">
				<img src="//y.gtimg.cn/mediastyle/mobile/project_v5/img/mv/mv_icon.png?max_age=2592000">
				{{getMVInfo.name}}
				<i class="mv_info__hd_more iconfont" :style="open?'transform:rotateZ(180deg)':''" @click="openFun">&#xe68d;</i>
			</div>
			<div class="gs_name">
				<span class="iconfont">&#xe654;</span>&nbsp;
				<span v-for="(singer,index) of getMVInfo.singers" :key="index">{{singer.name}}</span>
			</div>
			<div class="gs_detail">
				<!-- <span class="color">MV排行第6名(第197期)</span> -->
				<span>{{tranFormat(getMVInfo.playcnt)}}次播放</span>
				<span>{{time(getMVInfo.pubdate)}}</span>
			</div>
			<pre v-if="getMVInfo.desc !='' " class="js_mv_desc" v-html="getMVInfo.desc" :class="open?'':'more'"></pre>
			<div class="control_btn">
				<div class="control_btn_item" @click="noclick">
					<span class="iconfont">&#xe60c;</span>
					<p>收藏</p>
				</div>
				<div class="control_btn_item" @click="noclick">
					<span class="iconfont">&#xe6e9;</span>
					<p>下载</p>
				</div>
				<div class="control_btn_item" @click="noclick">
					<span class="iconfont">&#xe609;</span>
					<p>1.1万</p>
				</div>
			</div>

			<ul class="video_list" v-if="getRecomMV != null && getRecomMV != undefined">
				<li v-for="(getRecomMVItem,index) of getRecomMV.list" :key="index" @click="gotoCurrentMv(getRecomMVItem.vid,getRecomMVItem.type)">
					<div class="video_left">
						<!-- <img :src="'https://y.gtimg.cn/music/photo_new/T023R500x500M000'+getRecomMVItem.vid+'.jpg?max_age=2592000'"> -->
						<img :src="getRecomMVItem.cover_pic_medium">
						<div class="video_num">
							<span class="iconfont video_icon">&#xe63c;</span>
							<span>{{tranFormat(getRecomMVItem.playcnt)}}</span>
						</div>
					</div>
					<div class="qui_list">
						<h2 class="qui_list__txt">{{getRecomMVItem.name}}</h2>
						<p class="qui_list__desc">
							<span v-if="getRecomMVItem.type == 1">来自</span>
							<img class="mv_img" v-if="getRecomMVItem.type == 0" src="//y.gtimg.cn/mediastyle/mobile/project_v5/img/mv/mv_icon_S.png?max_age=2592000">
							<span v-if="getRecomMVItem.type == 1">&nbsp;&nbsp;{{getRecomMVItem.uploader_nick}}</span>
							<span>&nbsp;<i v-for="(singers,index) of getRecomMVItem.singers" :key="index">{{singers.name}}</i>&nbsp;</span>
						</p>
					</div>
				</li>
				
			</ul>
		</div>
		<!-- end 详情 -->

		<!-- 评论 -->
		<div class="replay"  v-show="toogle == 1" v-if="mvreplay != ''">
			<h3 class="jcpl_title">精彩评论 <span class="jcpl_num">{{mvreplay.hot_comment.commenttotal}}</span></h3>
			<ul class="replay_ul" v-if="biztype == 5">
				<li v-for="(commentlistitem,index) of mvreplay.hot_comment.commentlist" :key="index">
					<div class="mt_top">
						<img class="mt_img" :src="commentlistitem.avatarurl" alt="">
						<div class="mt_top_left">
							<h4><span>{{commentlistitem.nick}}</span><img v-if='commentlistitem.vipicon != ""' class="vipicon_icon" :src="commentlistitem.vipicon" alt=""></h4>		
							<time v-html="time(commentlistitem.time)"></time>
						</div>
						<span  @click="noclick" class="mt_top_right"><i>{{commentlistitem.praisenum}}</i><i class="iconfont">&#xe609;</i></span>
					</div>
					<pre class="replay_content">{{formatN(commentlistitem.rootcommentcontent)}}</pre>	
				</li>
			</ul>
			<ul class="replay_ul" v-if="biztype == 31">
				<li v-for="(commentlistitem,index) of mvreplay.comment.commentlist" :key="index">
					<div class="mt_top">
						<img class="mt_img" :src="commentlistitem.avatarurl" alt="">
						<div class="mt_top_left">
							<h4><span>{{commentlistitem.nick}}</span><img v-if='commentlistitem.vipicon != ""' class="vipicon_icon" :src="commentlistitem.vipicon" alt=""></h4>		
							<time v-html="time(commentlistitem.time)"></time>
						</div>
						<span  @click="noclick" class="mt_top_right"><i>{{commentlistitem.praisenum}}</i><i class="iconfont">&#xe609;</i></span>
					</div>
					<pre class="replay_content">{{formatN(commentlistitem.rootcommentcontent)}}</pre>	
				</li>
			</ul>
		</div>
		<!-- end 评论 -->

	</div>
</template>
<script>

	import {getmv,getmvkey,getmvreplay,ERROR_OK} from '@/api/getIndex'

	export default{
		name:'mv',
		data(){
			return{
				toogle:0,//0 ==> 详情，1==>评论
				vid:"",
				getMVInfo:{},
				getRecomMV:{},
				getToplistInfo:{},
				open:false,//视频简介，展开更多
				getMVUrl:'',//视频地址
				mvreplay:'',
				biztype:0,
			}
		},
		activated(){
			this.loading()
		},
		deactivated(){
			this.clear()
		},
		watch:{
			$route(to,form){
				let that = this
				that.clear()
				that.loading()
			}
		},
		methods:{
			back() {
                this.$router.back()
            },
			gotoCurrentMv(vid,type){
				let biztype
				if(type == 0){
					biztype = 5
				}else if(type == 1){
					biztype = 31
				}
				let that = this
				that.$router.push({
					path:'/mv',
					query:{
						vid:vid,
						biztype:biztype
					}
				})
			},
			loading(){
				let that = this
				that.$Indicator.open({
					spinnerType:'triple-bounce'
				})
				that.vid = that.$route.query.vid
				that.biztype = that.$route.query.biztype
				that._getmv()
				that._getmvkey()
				that._getmvreplay()
			},
			clear(){
				let that = this
				that.toogle = 0//0 ==> 详情，1==>评论
				that.vid = ""
				that.getMVInfo = {}
				that.getRecomMV = {}
				that.getToplistInfo = {}
				that.open = false//视频简介，展开更多
				that.getMVUrl = ''//视频地址
				that.mvreplay = ''
			},
			_getmv(){
				let that = this
				getmv(that.vid,res=>{
					if(res.data.code == ERROR_OK){
						if(res.data.getMVInfo.code == ERROR_OK){
							that.getMVInfo = res.data.getMVInfo.data[that.vid]
						}
						if(res.data.getRecomMV.code == ERROR_OK){
							that.getRecomMV = res.data.getRecomMV.data
						}
						if(res.data.getToplistInfo.code == ERROR_OK){
							that.getToplistInfo = res.data.getToplistInfo.data
						}
						that.$Indicator.close()
					}
					
				})
			},
			_getmvkey(){
				let that = this
				getmvkey(that.vid,res=>{
					//成功拿到的歌词数据（res）有函数包着 只能用字符串截取把函数去掉  并转成json格式  JSON.parse()
					let data = JSON.parse(res.data.substring(res.data.indexOf('(')+1,res.data.length-1))
					if(data.code == ERROR_OK){
						if(data.getMVUrl.code == ERROR_OK){
							let url = data.getMVUrl.data[that.vid].mp4
							for(let i in url){
								// console.log(url[i].freeflow_url)
								if(url[i].freeflow_url.length>0){
									that.getMVUrl = url[i].freeflow_url[0]
									return;
								}
							}
						}
					}
				})
			},
			_getmvreplay(){
				let that = this
				getmvreplay(that.vid,that.biztype,res=>{
					console.log(res)
					if(res.data.code == ERROR_OK){
						that.mvreplay = res.data
					}
				})
			},
			formatN(html){
				return html.replace(/\\n/g,"\n")
			},
			noclick(){
				this.$Toast({
					message:"无法操作~",
					duration:1000
				})
			},
			openFun(){
				this.open = !this.open
				consooe.log(this.open)
			},
			details(){
				let that = this
				that.toogle = 0
			},
			replay(){
				let that = this
				that.toogle = 1

			},
			time(now){
				let riqi = new Date(parseInt(now+'000'))
				var year=riqi.getFullYear(); 
				var month=riqi.getMonth()+1; 
				var date=riqi.getDate(); 
				var hour=riqi.getHours(); 
				var minute=riqi.getMinutes(); 
				var second=riqi.getSeconds(); 
				// return year+"-"+month+"-"+date+" "+hour+":"+minute+":"+second; 
				return year+"-"+month+"-"+date; 
			},
			//人数转换 ==>  万 亿
			tranFormat(num) {
				let newsnum = num+''
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
		}
	}
</script>
<style scoped>
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
.cnxht{
	/*padding:20px;*/
}
.vipicon_icon{
    width: 25px;
    height: 22px;
}
.cnxht .title{
	text-align: center;
	padding:20px 0px;
	font-size:16px;
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
.replay_ul li{
	padding:6px 0px;
}
.replay_num{
	font-size:12px;
}
.mv_img{
	height:11px;
}
.more{
	height: 15px;
    overflow: hidden;
}
.jcpl_title{
	font-size:15px;
}
.jcpl_num{
	color:grey;
	font-size:13px;
}
.replay{
	padding:16px;
}
.qui_list{
	padding:10px 0px;
    line-height:21px;
    margin-left:16px;
    border-bottom:0.3px solid rgba(0,0,0,.15);
}
.qui_list__desc{
	display: block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color:grey;
    font-size:12px;
}
.qui_list__txt{
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    font-size: 14px;
    -webkit-box-align: start;
    white-space: normal;
    word-break: break-all;

}
.video_left img{
	width:145px;
	height:81.56px;
}
.video_left{
	position:relative;
}
.video_num{
	position:absolute;
	bottom:0;
	background:rgb(0,0,0,.2);
	color:#fff;
	font-size:12px;
	width:100%;
	padding:2px 0px;
}
.video_num .video_icon{
	font-size:12px;
	display:inline-block;
	margin:0px 2px;
}
.video_list li{
	display:flex;
	margin:5px;
}
.video_list{
	padding:11px;
}
.control_btn{
	display:flex;
	justify-content:space-around;
	margin:10px 0px;
}
.control_btn .control_btn_item{
	text-align: center;
}
.control_btn .control_btn_item p{
	color:grey;
	font-size:13px;
	margin-top:5px;
}
.js_mv_desc{
	font-size:12px;
	color:grey;
	padding:5px 16px;
	white-space: pre-wrap;
	line-height:19px;
}
.gs_detail{
	display:flex;
	justify-content: space-between;
	color:grey;
	font-size:12px;
	padding:0 16px;
}
.gs_name{
	color:grey;
	font-size:12px;
	padding:4px 16px;
}
.mv_info__hd img{
	height:13px;
	margin-right:5px;
}
.color{
	color:#31c27c;
}
.details{
	position: relative;
}
.mv_info__hd{
	padding:0 16px;
	display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-height: 1.4;
    margin: 12px 20px 5px 0;
    overflow: hidden;
    font-size: 16px;
    font-weight: 700;

}
.mv_info__hd_more{
	position:absolute;
	right:15px;
	top:5px;
	color:grey;
}
.navbar{
	display:flex;
	border-bottom:0.3px solid rgba(0,0,0,.15);
}
.navbar .navbar_item{
	flex-grow: 1;
	text-align: center;
	line-height:35px;
	font-size:14px;
}
.select{
	color:#31c27c;
	position:relative;
	padding-bottom:9px;
}
.select:after{
	content:"";
	position:absolute;
	bottom:0;
	width:16px;
	height:3px;
	margin-left:-8px;
	display:block;
	left:50%;
	background:#31c27c;
}
</style>
