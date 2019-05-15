<template>
  <div id='songlist'>
  	<div class="songlist" v-if="radioList.length>0">
  		<h2 class="list_title">电台</h2>
  		<div class='list_con clear'>
  			<div class="list_item" v-for='radioListItem of radioList' :key='radioListItem.radioid' @click='gotoplaysong'>
  				<div class="img_con">
  					<img :src="radioListItem.picUrl" alt="">	
  					<span class='play_status'></span>	
  				</div>
  				<div class="bottom_title">
  					<span class="song_name">{{radioListItem.Ftitle}}</span>
  				</div>
  			</div>	

  		</div>
  	</div>	

  	<div class="songlist" v-if="songList.length>0">
  		<h2 class="list_title">热门歌单</h2>
  		<ul class='list_con'>
  			<li class="list_item" v-for='songListItem of songList' :key='songListItem.id' @click='gotoGedanList(songListItem.id)'>
  				<div class="img_con">
  					<img :src="songListItem.picUrl" alt="">
  					<div class='play_num_ringtone'>
  						<span class="play_ringtone"></span>
  						<span class="play_num">{{tranFormat(songListItem.accessnum)}}</span>
  					</div>
  					<span class='play_status'></span>	
  					<div class="play_background">
  						
  					</div>
  				</div>
  				<div class="bottom_title">
  					<span class="song_name">{{songListItem.songListDesc}}</span>
  					<span class="song_author">{{songListItem.songListAuthor}}</span>
  				</div>
  			</li>	
  		</ul>
  	</div>	

  </div>
</template>
<script>
	import {mapState} from 'vuex'
	import {getradiosonglist,ERROR_OK} from '@/api/getIndex.js'

	export default {
	  name: 'songlist',
	  data(){
			return{

			}
		},
		computed:{
			...mapState([
				"radioList",
				"songList"
			])
		},
		methods:{
			gotoGedanList(res){
				let that = this
				this.$router.push({
					path:'/gedanlist',
					query:{
						id:res
					}
				})
			},
			gotoplaysong(){
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

							//已注释 此处就不用缓存了  因为如果没有进入songlist.vue页面就不存在缓存  直接复制playsong.vue页面链接给别人听会有问题，暂时只能用url一起传过去
							// localStorage.setItem('mid',JSON.stringify(mid))
							// localStorage.setItem('getLyricmid',res.data.data[0].mid)
							that.$router.push({
								path:'/playsong',
								query:{
									songid:dataId.toString(),
									mid:mid.toString(),
									getLyricmid:getLyricmid.toString()
								}
							})
						}else{
							console.log("参数错误")
						}
					}
				})

			},	
			//人数转换 ==>  万 亿
			tranFormat(num) {
				let newsnum = num.toString()
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
	}

</script>
<style scoped>
	.list_title{
		font-size: 16px;
	    color: #000;
	    margin-bottom: 11px;
	    font-weight: normal;
	    margin-left:5px;
	}
	.songlist{
		margin:15px 10px;
	}
	.img_con{
		height: 80%;
		overflow:hidden;
		position:relative;
	}
	.play_status{
		position:absolute;
		background:url('../../assets/list_sprite.png') no-repeat;
		background-size:24px;
		height: 24px;
		bottom: 5px;
		right: 5px;
		width: 24px;
		background-position: 0 0;
	}
	.play_ringtone{
		background:url('../../assets/list_sprite.png') no-repeat;
		background-size:24px;
		height: 10px;
		bottom: 5px;
		left: 5px;
		width: 10px;
		background-position: 0 -50px;
	}
	.img_con img{
		width:100%;
		height:100%;
	}
	.list_con{
		display:block;
		margin-right:-8px;
		overflow:hidden;
	}
	.list_item{
		padding-right:8px;
		overflow: hidden;
		display: inline-block;
		width:50%;
		float:left;
		-webkit-box-sizing:border-box;
		margin-bottom:10px;
	}
	.bottom_title{
		overflow:hidden;
		background:#fff;
		padding:5px;
		min-height:29px;
		max-height:29px;
	}
	.bottom_title .song_name{
		/*display:-webkit-box;*/
		text-overflow:ellipsis;
		overflow:hidden;
		white-space:nowrap;
		/*-webkit-line-clamp:2;*/
		/*-webkit-box-orient:vertical;*/
		font-size:14px;
		display:block;
		/*min-height:28px;
		max-height:28px;*/
	}
	.bottom_title .song_author{
		text-overflow:ellipsis;
		overflow:hidden;
		white-space:nowrap;
		font-size:14px;
	}
	.play_num_ringtone{
		position:absolute;
		left:0;
		bottom:0;
		color:#fff;
		font-size:14px;
		margin:7px;
		display:flex;
		justify-content: center;
		align-items:center;	
		z-index:9;
	}
	.play_background{
		position:absolute;
		left:0;
		bottom:0;
		right:0;
		background:linear-gradient(to top,rgba(0,0,0,.8),rgba(0,0,0,.1));
		z-index:8;
		height:30px;
	}
	.play_num{
		font-size:13px;	
		margin-left:5px;
	}
	.clear:after{
		content:"";
		display:block;
		clear:both;
	}

</style>
