import Vue from 'vue'
import VueRouter from 'vue-router'
import Recomment from 'views/recomment/recomment'
import Ranking from 'views/ranking/ranking'
import Search from 'views/search/search'
import GedanList from 'views/gedanlist/gedanlist'
import Components from 'components/components'
import Index from 'components/index/index'
import TopList from 'views/toplist/toplist'
import Singer from 'views/singer/singer'
import Album from 'views/album/album'
import Playsong from 'views/playsong/playsong'
import Mv from 'views/mv/mv'


Vue.use(VueRouter)

export default new VueRouter({
    routes:[
        {
            path: '/',
            name: 'index',
            components:{
                'components':Index
            },
            redirect:'/recomment',
            children:[
                {
                    path:'/recomment',
                    name:'recomment',
                    components:{
                        'index':Recomment
                    },
                    children:[

                    ]
                },
                {
                    path:'/ranking',
                    name:'ranking',
                    components:{
                        'index':Ranking
                    }
                },
                {
                    path:'/search',
                    name:'search',
                    components:{
                        'index':Search
                    }
                }
            ]
        },
        {
            path:'/gedanlist',
            name:'gedanlist',
            components:{
                'components':GedanList
            }
        },{
            path:'/toplist',
            name:'toplist',
            components:{
                'components':TopList
            }
        },
        {
            path:'/singer',
            name:'singer',
            components:{
                'components':Singer
            }
        },
        {
            path:'/album',
            name:'album',
            components:{
                'components':Album
            }
        },
        {
            path:'/playsong',
            name:'playsong',
            components:{
                'components':Playsong
            }
        },
        {
            path:'/mv',
            name:'mv',
            components:{
                'components':Mv
            }
        }
    ],
    scrollBehavior (to, from, savedPosition) {
        // console.log(savedPosition)
        //     if (savedPosition) {
        //            return savedPosition
        //    } else {
        //    	console.log(from.meta.keepAlive)
        //        if (from.meta.keepAlive) {
        //        　　from.meta.savedPosition = document.body.scrollTop;
        //        }
        //        console.log(to.meta.savedPosition)
        //        return { x: 0, y: to.meta.savedPosition || 0}
        //    }
        return { x: 0, y:0}
    }
})


