<template>
	<div id='swiper'>
		<mt-swipe class='swiper' :style='swiperHeight' style="height:200px;" :auto="auto">
		  <mt-swipe-item v-if="slider.length>0" v-for='sliderItem of slider' :key='sliderItem.id'>
		  	<img ref='swiperImg' class="swiper_img" :src="sliderItem.picUrl">
		  </mt-swipe-item>
		</mt-swipe>
	</div>
</template>
<script>
	import {mapState} from 'vuex'

	export default{
		name:'swiper',
		data(){
			return{
				auto:1500,
				swiperHeight:{height:'20px'}
			}
		},
		mounted() {
			window.onresize = () => {
				window.location.reload();
			}
		},
		watch:{
			slider(){
				let that = this
				setTimeout(()=>{
					// 设置高度
					that.swiperHeight = {
						height:parseInt(that.$refs.swiperImg[0].height)+'px'
					}
				},200)
			}
		},
		computed:{
			...mapState([
				"slider"
			])
		}
	}
</script>
<style scoped>
	.swiper{
		position:relative;
		z-index:2;
	}
	.swiper:after{
		/*content:"";*/
		position:absolute;
		top:0;
		left:0;
		right:0;
		width:100%;
		padding-bottom:40%;
		background:#ccc;
		z-index:1;
	}
	.swiper .swiper_img{
		width: 100%;
	}
	.swiper >>> .is-active{
		opacity:1;
		background:#fff;
	}
	.swiper >>> .mint-swipe-indicator{
		opacity:0.5;
	}


</style>