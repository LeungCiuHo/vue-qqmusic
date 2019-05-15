<template>
	<div id='songranks'>
		<div class="rankings">
			<div v-for='topListItem of topList' :key='topListItem.id' @click='gotoTopList(topListItem.id)' class="ranking_item">
				<div class="item_img">
					<img :src="topListItem.picUrl">
					<div class='play_num_ringtone'>
  						<span class="play_ringtone"></span>
  						<span class="play_num">{{tranFormat(topListItem.listenCount)}}</span>
  					</div>
				</div>
				<div class="ranking_info">
					<h2>{{topListItem.topTitle}}</h2>
					<p class="ranking_p" v-for='item of topListItem.songList'><i class="ccc">1 </i><span>{{item.songname}}</span><i class="ccc"> - {{item.singername}}</i></p>
				</div>
				<i class="topic_arrow"></i>
			</div>
		</div>
	</div>
</template>
<script>
	import {getRanking,ERROR_OK} from '@/api/getIndex'
	export default{
		name:'songranks',
		data(){
			return {
				topList:[]
			}
		},
		created(){
			let that = this
			that.$Indicator.open({
				spinnerType:'triple-bounce'
			})
			that._getRanking()
		},
		methods:{
			_getRanking(){
				let that = this
				getRanking(res=>{
					if(res.data.code == ERROR_OK){
						that.topList = res.data.data.topList
					}
					that.$Indicator.close()
				})
			},
			gotoTopList(res){
				this.$router.push({
					path:'/toplist',
					query:{
						id:res
					}
				})
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
	.rankings{
		display:block;
		padding:10px;
	}
	.ranking_item{
		background:#fff;
		margin-bottom:10px;
		display:flex;
		position:relative;
		overflow:hidden;
	}
	.ranking_p{
	    white-space: nowrap;
	    overflow: hidden;
	    text-overflow: ellipsis;
	    width: 78%;
	}
	.item_img{
		position:relative;
		width:100px;
		height:100px;
	}
	.item_img img{
		width:100px;
		height:100px;
	}
	.play_ringtone{
		background:url('../../../../../assets/list_sprite.png') no-repeat;
		background-size:24px;
	    height: 10px;
	    bottom: 5px;
	    left: 5px;
	    width: 10px;
	    background-position: 0 -50px;
	}
	.play_num{
		font-size:13px;	
		margin-left:5px;
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
	.ccc{
		color:rgba(0,0,0,.5);
	}
	.ranking_info{
		font-size:14px;
		line-height:25px;
		margin:0 10px 0 15px;
	}
	.topic_arrow{
		position: absolute;
	    right: 10px;
	    top: 50%;
	    margin-top: -4px;
	    width: 6px;
	    height: 6px;
	    border-right: 1px solid #b2b2b2;
	    border-bottom: 1px solid #b2b2b2;
	    transform: rotate(-45deg);
	}
</style>