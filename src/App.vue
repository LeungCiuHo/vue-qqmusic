<template>
  <div id='app'>
  	<components></components>
  </div>
</template>
<script>
	import components from 'components/components'
	export default {
	  name: 'app',
	  components:{
	  	components
	  }
	}

</script>
<style>
 	body,html{
		height:100%;
	}
	body{
		background:rgb(255,255,255);
	}
	#ranking{
		background:rgb(244,244,244);
	}
	#recomment{
		background:rgb(244,244,244);
	}
	.left{
		float:left;
	}
	.right{
		float:right;
	}
	.clear:after{
		content:"";
		display:block;
		clear:both;
	}
	.mint-spinner-triple-bounce >div,.mint-spinner-double-bounce >div{
		background:#31c27c!important;
	}
	.mint-spinner-double-bounce{
		margin:0px auto;
	}
	.loading_con{
	    padding: 20px;
	    text-align: center;
	}
</style>
