<template>
	<div id='bar'>
		<ul class="bar_ul">
			<slot></slot>
		</ul>
	</div>
</template>

<script>
	export default{
		name:'bar',
	}
</script>

<style scoped>
	.bar_ul{
		background: #fff;
		display: -webkit-box;
		-webkit-tap-highlight-color: rgba(0,0,0,0);
		margin-top: 80px;
	}
	.bar_ul li{
		-webkit-box-flex: 1;
		position: relative;
		display: block;
		height: 40px;
		line-height: 40px;
		overflow: hidden;
		text-align: center;
		font-size: 16px;
		color: rgba(0,0,0,.6);
		text-decoration: none;
		-webkit-tap-highlight-color: rgba(0,0,0,0);
	}
	
</style>