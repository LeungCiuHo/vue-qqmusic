import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state:{
		slider:[],
		radioList:[],
		songList:[]
	},
	mutations:{
		setSlider(state,slider){
			state.slider = slider
		},
		setRadioList(state,radioList){
			state.radioList = radioList
		},
		setSongList(state,songList){
			state.songList = songList
		}
	}
})
