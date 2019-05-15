<template>
	<div id='recomment'>
		<qq-swiper></qq-swiper>
		<qq-song-list></qq-song-list>
	</div>
</template>
<script>
	import qqSwiper from 'recomment/swiper/swiper'
	import qqSongList from 'recomment/songlist/songlist'
	import {getRecomment,getext,ERROR_OK} from '@/api/getIndex.js'

	export default{
		name:'recomment',
		components:{
			qqSwiper,
			qqSongList,
		},
		created(){
			let that = this
			that.$Indicator.open({
				spinnerType:'triple-bounce'
			})
			that._getRecomnent()
		},
		methods:{
			_getRecomnent(){
				let that = this
				getRecomment(res=>{
					if(res.data.code == ERROR_OK){
						that.$store.commit('setSlider',res.data.data.slider)
						that.$store.commit('setRadioList',res.data.data.radioList)
						that.$store.commit('setSongList',res.data.data.songList)
						that.$Indicator.close()
					}
				})
			}
		}

	}
</script>
<style>
	
</style>
