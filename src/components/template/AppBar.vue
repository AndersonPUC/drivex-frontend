<template>
	<v-app-bar :clipped-left="$vuetify.breakpoint.lgAndUp" app>
		<v-toolbar-title style="width: 300px" class="ml-0 pl-4 pr-0">
			<v-app-bar-nav-icon @click.stop="toggleDrawer" />
			<span>
				<img src="@/assets/logo.png" class="img-logo" height="60"/>
			</span>
		</v-toolbar-title>
		<v-spacer />
		<v-menu left bottom offset-y>
			<template v-slot:activator="{ on }">
				<v-btn icon v-on="on" large>
					<v-icon>account_circle</v-icon>
				</v-btn>
			</template>
			<v-list>
				<v-list-item class="userPanel">
					<v-list-item-icon>
						<v-icon>perm_identity</v-icon>
					</v-list-item-icon>
					<v-list-item-title>{{user.nome}}</v-list-item-title>
				</v-list-item>
				<v-divider />
				<v-list-item @click="logout">
					<v-list-item-icon>
						<v-icon color="red">exit_to_app</v-icon>
					</v-list-item-icon>
					<v-list-item-content>Sair</v-list-item-content>
				</v-list-item>
			</v-list>
		</v-menu>
	</v-app-bar>
</template>
<script>
	import AppLogo from '../widgets/AppLogo'
	import { mapMutations, mapState } from 'vuex'

	export default {
		components: { AppLogo },
		data: () => ({}),
		methods: {
			...mapMutations(['toggleDrawer']),
			logout() {
				this.$store.dispatch('logout')
				this.$router.push('/signin')
			}
		},
		computed: {
			...mapState(['user'])
		}
	}
</script>
<style scoped>
	.userPanel {
		min-width: 250px;
	}
</style>