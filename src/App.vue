<template>
	<v-app id="app">
		<AppAlert />
		<AppMenu v-if="userAtivo && !loading && !this.$route.path.includes('/report/locacao/')" />
		<AppBar v-if="userAtivo && !loading  && !this.$route.path.includes('/report/locacao/')" />
		<AppContent v-if="!loading" />

		<!-- <AppLoading v-if="loading" /> -->
	</v-app>
</template>
<script>
import { mapGetters } from 'vuex'
import AppBar from './components/template/AppBar'
import AppMenu from './components/template/AppMenu'
import AppContent from './components/template/AppContent'
// import AppLoading from './components/widgets/AppLoading'
import AppAlert from './components/widgets/AppAlert'

export default {
	components: {
		AppBar,
		AppContent,
		AppMenu,
		AppAlert
	},
	data: function() {
		return {
			loading: true,
			rotasPublicas: ['Signin', 'Signup']
		}
	},
	methods: {
		async checkUser() {
			try {
				this.loading = true
				const localUserString = localStorage.getItem(this.$store.state.userKey)

				if (!localUserString) throw new Error('')

				const localUser = JSON.parse(localUserString)

				if (!localUser) throw new Error('')

				await this.axios.post('/auth', { bearer: localUser.accessToken })
				this.$store.dispatch('login', localUser)
			} catch (error) {
				this.publico()
			} finally {
				this.loading = false
			}
		},
		publico() {
			this.$store.dispatch('logout')
			if (this.rotasPublicas.includes(this.$router.currentRoute.name)) return
			this.$router.push('/signin')
		}
	},
	computed: {
		...mapGetters(['userAtivo'])
	},
	mounted() {
		this.checkUser()
	}
}
</script>
