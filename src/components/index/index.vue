<template>
    <div id='index'>
        <qq-header></qq-header>
        <qq-bar>
            <router-link tag='li' :to='item.to' v-for='item in barList' :key='item.id'>{{item.title}}</router-link>
        </qq-bar>
        <keep-alive>
            <router-view name='index'></router-view>
        </keep-alive>
    </div>
</template>
<script>
    import qqHeader from 'components/index/header/header'
    import qqBar from 'components/index/bar/bar'

    export default{
        name:'index',
        components:{
            qqHeader,
            qqBar
        },
        data(){
            return{
                barList:[{
                    id:0,
                    title:'推荐',
                    to:'/recomment'
                },{
                    id:1,
                    title:'排行榜',
                    to:'/ranking'
                },{
                    id:2,
                    title:'搜索',
                    to:'/search'
                }]
            }
        }
    }
</script>
<style scoped>
    .router-link-active{
        color:#31c27c!important;
        border-bottom:2px solid #31c27c!important;
    }
    #search{
        background:#fff;
    }
</style>