export default {
	namespaced: true,
	state: {
		usuario: {},
		dialog: false,
		dialogLoading: false
	},
	mutations: {
		setUsuario(state, usuario) {
			state.usuario = usuario
		},
		setDialog(state, dialog) {
			state.dialog = dialog
		},
		setDialogLoading(state, loading) {
			state.dialogLoading = loading
		}
	},
	actions: {
		showDialog({ commit }) {
			commit('setDialog', true)
		},
		hideDialog({ commit }) {
			commit('setDialog', false)
		}
	}
}
