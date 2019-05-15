// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from '@/router/index'
import store from '@/store/index'
import {Toast,Indicator,Spinner,Swipe, SwipeItem,InfiniteScroll,MessageBox} from 'mint-ui'
import axios from 'axios'


// axios.defaults.baseURL = 'http://localhost:8080'

Vue.prototype.$axios = axios
Vue.prototype.$Toast = Toast
Vue.prototype.$Indicator = Indicator
Vue.prototype.$MessageBox = MessageBox

Vue.use(InfiniteScroll);

Vue.component(Swipe.name, Swipe);
Vue.component(Spinner.name, Spinner)
Vue.component(SwipeItem.name, SwipeItem);


import 'reset-css'
import '@/iconfont/iconfont.css'
Vue.config.productionTip = false


/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    // axios,
    components: { App },
    template: '<App/>'
})
