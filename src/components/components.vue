<template>
	<div id="components">
		<keep-alive exclude="album">
			<router-view name='components'></router-view>
		</keep-alive>
	</div>
</template>
<script>
	export default{
		name:'components',
	}
</script>
<style>

</style>