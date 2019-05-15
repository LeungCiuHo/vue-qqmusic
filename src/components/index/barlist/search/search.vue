<template>
	<div id='search'>
		<div class="serach_bar" :style='serachBar'>
			<div class="search">
				<span class='iconfont search_icon'>&#xe61d;</span>
				<input @click='songInput' @keyup.enter='serachEnter' @keyup.delete='inputDelete' v-model='searchData' placeholder="搜索歌曲、歌单、专辑" class='serach_input' type="text" name="search">
				<i v-if='searchData != ""' class='iconfont clear_inputValue' @click='clearInputValue'>&#xe603;</i>
			</div>
			<span v-if='cancel' class="cancel" @click='cancelBtn'>取消</span>
		</div>
		<div ref='afterHeight' style="width:100%;height:1px;"></div>
		<div class="remen_search" v-show='!cancel'>
			<h3 class="remen_title">热门搜索</h3>
			<div class="remen_list">
				<span class="remen_list_item tag_host" @click='setSearchValue(special_key)' :title='special_url'>{{special_key}}</span>
				<span v-for='hotkeyItem of hotkey' :key='' class="remen_list_item" @click='setSearchValue(hotkeyItem.k)'>{{hotkeyItem.k}}</span>
			</div>
		</div>
		<div class="loading_con" v-if='loading'>
			<mt-spinner type="triple-bounce"></mt-spinner>
		</div>

		
		<div class='songList' v-if='songListShow'>
			<div class="bscroll" ref="bscroll">
				<ul>
					<li class='songList_li' v-if='querySearchData.zhida.type == 2' @click='gotoSinger(querySearchData.zhida.singermid,querySearchData.zhida.type)'>
						<img class='geshou_fm left' v-if='querySearchData.zhida.singermid && querySearchData.zhida.singermid != ""' :src="'https://y.gtimg.cn/music/photo_new/T001R68x68M000'+querySearchData.zhida.singermid+'.jpg?max_age=2592000'" alt="">
						
						<div class="geshou_info left">
							<h4>{{querySearchData.zhida.singername}}</h4>
							<div class="geshou_other">
								<span v-if='querySearchData.zhida.songnum && querySearchData.zhida.songnum != ""'>单曲：{{querySearchData.zhida.songnum}}</span>
								<span v-if='querySearchData.zhida.albumnum && querySearchData.zhida.albumnum != ""'>专辑：{{querySearchData.zhida.albumnum}}</span>
							</div>	
						</div>
					</li>
					<li class='songList_li' v-if='querySearchData.zhida.type == 3' @click='gotoSinger(querySearchData.zhida.albummid,querySearchData.zhida.type)'>
						<img class='geshou_fm left' v-if='querySearchData.zhida.albummid && querySearchData.zhida.albummid != ""' :src="'https://y.gtimg.cn/music/photo_new/T002R68x68M000'+querySearchData.zhida.albummid+'.jpg?max_age=2592000'" alt="">
						<div class="geshou_info left">
							<h4>{{querySearchData.zhida.albumname}}</h4>
							<div class="geshou_other">
								<span>{{querySearchData.zhida.singername}}</span>
							</div>	
						</div>
					</li>
					 <!-- 由于qq音乐传过来的id重复了 所以此处只能使用下标(index)  此处只是获取数据  没有影响 -->
					<li v-for='(songDataList,index) of querySearchData.song.list' @click='gotoplaysong(songDataList.pay.paydownload == 0 && songDataList.pay.payinfo == 0 && songDataList.pay.paytrackmouth == 0 && songDataList.t == 0 && songDataList.alertid == 0,songDataList.songid,songDataList.songmid,songDataList.pay.payplay == 1)' :key='index' class='songList_li'>
						<i class="iconfont qq_music">&#xe680;</i>
						<div class="geshou_info left">
							<h4 v-html='songDataList.songname'></h4>
							<div class="geshou_other">
								<span v-for='(songItem,index) of songDataList.singer' :key='songItem.id' v-html='songItem.name'><i v-if='index>0'>/</i></span>
							</div>	
						</div>
					</li>
				</ul>
			</div>
		</div>
		<!-- 搜索历史 -->
		<div class="search_history" v-show='searchHistoryFlag'>
			<ul class="search_history_ul">
				<li class="clear" v-for='(searchHistoryItem,index) of searchHistory' :key='index' @click='clickHistory(searchHistoryItem)'><i class="iconfont history_icon left">&#xe74d;</i><span class="left history_text">{{searchHistoryItem}}</span><i class="clear_his_icon iconfont right" @click.stop='clearHistory(searchHistoryItem)'>&#xe646;</i></li>
			</ul>
			<div class="clear_all_history">
				<span @click='clearAllRecode' v-if='searchHistory.length >0'>清除搜索记录</span>
			</div>
		</div>
	</div>
</template>
<script>
	import {getSearch,getSearchSongList,getSinger,ERROR_OK} from '@/api/getIndex'
	import BScroll from 'better-scroll'
	import $ from 'jquery'


	let flag = true
	export default{
		name:'search',
		data(){
			return{
				hotkey:[],
				special_key:'',
				special_url:'',
				serachBar:{
					display:'block'
				},
				cancel:false,
				searchData:'',
				songListShow:false,
				querySearchData:{},
				searchHistory:[],//搜索历史
				searchHistoryFlag:false,
				loading:false,//显示加载效果
				p:1,//默认1  加载数据使用
				developer:false,
				bscrollHeight :0,//计算better-scroll高度
			}
		},
		watch:{
			songListShow(){
				let that = this
				if(that.songListShow == true){
					that.scrollLoadMore()
				}
			}
		},
		activated(){
			let that = this
			that.developer = false
			that.$Indicator.open({
				spinnerType:'triple-bounce'
			})
			that._getSearch()
			that.bscrollHeight = (document.body.clientHeight - that.$refs.afterHeight.offsetTop) +'px'
			
		},
		deactivated(){
			let that = this
			that.hotkey = []
			that.special_key = ''
			that.special_url = ''
			that.serachBar = {
				display:'block'
			}
			that.cancel = false
			that.searchData = ''
			that.songListShow = false
			that.querySearchData = {}
			that.searchHistory = []//搜索历史
			that.searchHistoryFlag = false
			that.loading = false//显示加载效果
			that.p = 1//默认1  加载数据使用
			that.developer = false
		},
		methods:{
			_getSearch(){
				getSearch(res=>{
					let that = this
					if(res.data.code == ERROR_OK){
						that.hotkey = res.data.data.hotkey,
						that.special_key = res.data.data.special_key,
						that.special_url = res.data.data.special_url
					}
					that.$Indicator.close()
				})
			},
			//歌曲下拉加载
			scrollLoadMore() {
				let that = this
				that.$nextTick(() => {
	            	that.scroll = new BScroll(that.$refs.bscroll, {
	                    click: true,
	                    scrollY: true,
	                    probeType: 1,
	                    bounce:true,
	                    pullUpLoad:{
	                          threshold: 0, // 当上拉到超过底部 70px 时，                    
	                  	}
	                })
	        		that.$refs.bscroll.style.height = that.bscrollHeight
					that.scroll.refresh();

				 	that.scroll.on('scroll', (pos) => {
	                    if(pos.y>50){
	                        that.developer = true
	                    }else{
	                        that.developer = false
	                    }
	                })

			      	that.scroll.on("pullingUp",function(){
				       	if(flag){
				       		that.$Indicator.open({
					       		text: '正在加载数据',
								spinnerType:'triple-bounce'
							})
						  	setTimeout(()=>{
						  		let p = that.p+1
						       	getSearchSongList(that.searchData,p,res=>{
									if(res.data.code == ERROR_OK){
										let oldQuerySearchData = that.querySearchData
										let getList = res.data.data.song.list
										if(res.data.data.song.list.length >0){
											that.p = p  //成功获取数据  页数+1
											//获取第二页数据
											for(let i in getList){
												oldQuerySearchData.song.list.push(getList[i])
											}
											that.querySearchData = oldQuerySearchData
											setTimeout(()=>{
												that.$Indicator.close()
											},1000)
											flag = true //有数据  允许进入
										}else{
											setTimeout(()=>{
												that.$Indicator.close()
											},1000)
											that.$Toast({
									       		message: '没有更多数据啦',
									       		position:'bottom',
												duration:1000
											})
											setTimeout(()=>{
												that.$Indicator.close()
											},1000)
											flag = false //没有数据  不允许
										}
		 								that.scroll.refresh();
										that.scroll.finishPullUp();//可以多次执行上拉刷新
				 						
									}
									
							})
						  	},1000)
				       	}
				    })
				})
			},
			songInput(){
				let that = this
				that.getSearchHistory()
				that.cancel = true
				that.serachBar = {
					display:'flex'
				}
			},
			gotoplaysong(flag,songid,songmid,payplay){
				let that = this
				if(flag){
					that.$MessageBox("QQ音乐","抱歉,此歌不允许播放！")
				}else if(payplay){
					that.$MessageBox("QQ音乐","唱片公司不让免费听这首歌了，可前往qq音乐客户端购买后畅享")
				}else{
					that.$router.push({
						path:'/playsong',
						query:{
							searchSongid:songid,
							songmid:songmid
						}
					})
					// getmusicu
				}
			},
			getSearchHistory(){
				let that = this
				that.searchHistoryFlag = true  //是否显示历史记录
				let searchHistory = []
				let searchList = JSON.parse(localStorage.getItem('searchList'))
				for(let i in searchList){
					searchHistory.push(searchList[i])
				}
				that.searchHistory = searchHistory.reverse()
			},
			cancelBtn(){
				let that = this
				that.cancel = false
				that.songListShow = false
				that.searchData = ''
				that.searchHistoryFlag = false //取消以后不显示历史列表
				that.serachBar = {
					display:'block'
				}
			},
			serachEnter(){
				let that = this
				let val = $.trim(that.searchData)

				that.loading = true
				// that.noresult = false  //控制显示没有更多数据啦
				if(localStorage.getItem('searchList') == null){
					let tempVal = {}
					tempVal[val] = val
					localStorage.setItem('searchList',JSON.stringify(tempVal))
				}else{
					let searchListItem = JSON.parse(localStorage.getItem('searchList'))


					if(searchListItem.hasOwnProperty(val)){
						for(let i in searchListItem){
							if(searchListItem[i] ==  val){
								delete searchListItem[i]
							}
						}
					}
					searchListItem[val] = val
					localStorage.setItem('searchList',JSON.stringify(searchListItem))
				}
				that.searchHistoryFlag = false
				that.p = 1 //重新搜索则设置为第一页
				if(that.searchData && that.searchData != ''){
					getSearchSongList(that.searchData,that.p,res=>{
						if(res.data.code == ERROR_OK){
							that.songListShow = true
							that.querySearchData = res.data.data
							that.scrollLoadMore()
						}
						that.loading = false  //加载完成，隐藏加载效果
						flag = true  //允许上拉
					})
				}
			},
			inputDelete(){
				let that = this
				if(that.searchData == ''){
					that.songListShow = false
				}
			},
			setSearchValue(res){
				let that = this
				that.searchData = res
				that.songInput()
				that.serachEnter()			
			},
			clearInputValue(){
				let that = this
				that.searchData = ''
				that.getSearchHistory()
				that.searchHistoryFlag = true   //是否显示历史记录
				that.songListShow = false	//是否显示歌曲列表
			},
			clickHistory(res){
				let that = this
				that.setSearchValue(res)
				that.searchHistoryFlag = false
			},
			clearHistory(res){
				let that = this
				if(localStorage.getItem('searchList') != null){
					let searchList = JSON.parse(localStorage.getItem('searchList'))
					for(let i in searchList){
						if(searchList[i] == res){
							delete searchList[i]
						}
					}
				localStorage.setItem('searchList',JSON.stringify(searchList))
				}
				that.getSearchHistory()
			},
			clearAllRecode(){
				let that = this
				localStorage.clear();
				that.getSearchHistory()
			},
			gotoSinger(id,type){
				if(type == 2){
					this.$router.push({
						path:'/singer',
						query:{
							id:id
						}
					})
				}else if(type == 3){
					this.$router.push({
						path:'/album',
						query:{
							id:id,
							other:"false"
						}
					})
				}
				
			}
		}
	}
</script>
<style scoped>
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
		position:relative;
	}
	.clear_all_history{
		color:#47c88a;
		font-size:13px;
		padding:20px;
		text-align: center;
	}
	.clear_all_history span{
		display:inline-block;
		padding:5px;

	}
	.history_text{
		color:rgb(110,110,110);
	}
	.history_icon{
		margin-right:10px;
		color:rgba(0,0,0,.5);
		font-size:20px;
	}
	.clear_his_icon{
		color:rgba(0,0,0,.5);
	}
	.serach_bar{
		background:rgb(244,244,244);
		padding:10px;
	}
	.search{
		background:#fff;
		padding:10px;
		border-radius:3px;
		display:flex;
		width:93%;
		position:relative;
	}
	.clear_inputValue{
		position:absolute;
		right:0;
		color:#ccc;
		font-size:25px;
		top:6px;
	}
	.serach_input{
		color:rgba(0,0,0,.3);
		border:none;
		outline:none;
		padding-left:6px;
		font-size:14px;
		width:80%;
	}
	.remen_search{
		background:#fff;
		padding:20px;
	}
	.remen_title{
	    color: rgba(0,0,0,.9);
   		margin-bottom: 8px;
   		font-size:14px;
	}
	.remen_list{
		margin:10px 0px;
		height: 126px;
		overflow: hidden
	}
	.remen_list_item{
	    color: #fc4524;
    	border-color: #fc4524;
    	display: inline-block;
	    font-size: 14px;
	    padding: 0 10px;
	    height: 30px;
	    line-height: 30px;
	    color: #000;
	    border: 1px solid rgba(0,0,0,.6);
	    border-radius: 99px;
	    word-break: keep-all;
	    margin-bottom: 10px;
	    margin-right: 14px;
	}
	.tag_host{
		color: #fc4524;
    	border-color: #fc4524;
	}
	.cancel{
		padding-right: 10px;
	    padding-left: 10px;
	    font-size: 14px;
	    height: 38px;
	    line-height: 37px;
	    display:block;
	    width:36px;
	    overflow:hidden;
	}
	.search_icon{
		margin-top:2px;
	}
	.songList_li{
		padding:10px;
		display:flex;
		border-bottom:1px solid #e5e5e5;
	}
	.search_history_ul li{
		border-bottom:1px solid #e5e5e5;
		padding:15px 20px;
		display:block;
		font-size:14px;
		line-height:20px;
	}
	.geshou_fm{
	    top: 8px;
	    left: 8px;
	    width: 40px;
	    height: 40px;
	    border-radius:50%;
	}
	.geshou_info{
	    line-height: 18px;
	    font-size: 14px;
	    font-weight: normal;
	    color: #000;
	    margin:2px 0px 0px 10px;
	}
	.geshou_other{
		color:#808080;
		font-size:12px;
	}
	.qq_music{
		margin-top:10px;
	}
</style>
