import Vue from 'vue'
import './plugins/axios'
import './mixins'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import store from './store'
import router from './router'

import VueMask from 'v-mask'

Vue.use(VueMask);


Vue.config.productionTip = false

new Vue({
	vuetify,
	router,
	store,
	render: h => h(App)
}).$mount('#app')
