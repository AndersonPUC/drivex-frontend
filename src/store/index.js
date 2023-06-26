import Vue from 'vue'
import Vuex from 'vuex'

import usuarios from './modules/usuarios'

Vue.use(Vuex)

const store = new Vuex.Store({
	modules: { usuarios },
	state: {
		user: null,
		drawer: true,
		userKey: 'user',
		alert: {}
	},
	getters: {
		userAtivo: state => {
			return state.user !== null && !state.user.inativo
		},
		userAdmin: state => {
			return state.user !== null && state.user.role === "admin_role"
		},
		userRole: state => {
			return state.user.role
		}
	},
	mutations: {
		toggleDrawer(state) {
			state.drawer = !state.drawer
		},
		setDrawer(state, drawer) {
			state.drawer = drawer
		},
		setUser(state, user) {
			state.user = user
		},
		setAlert(state, alert) {
			state.alert = alert
		}
	},
	actions: {
		login({ commit, state }, user) {
			commit('setUser', user)
			localStorage.setItem(state.userKey, JSON.stringify(user))
			Vue.axios.defaults.headers.common['Authorization'] = `Bearer ${user.accessToken}`
		},
		logout({ commit, state }) {
			commit('setUser', null)
			localStorage.removeItem(state.userKey)
		},
		showError({ commit }, error) {
			let msg = ''
			if (typeof error === 'string') msg += error
			else if (error.response.data.detalhes) {
				msg += error.response.data.detalhes
			} else if (error.response.data.msg) {
				msg += error.response.data.msg
			} else {
				msg += error.message
			}
			commit('setAlert', { color: 'error', msg, visible: true })
		},
		showSuccess({ commit }, msg) {
			commit('setAlert', { color: 'success', msg, visible: true })
		}
	}
})

export default store
