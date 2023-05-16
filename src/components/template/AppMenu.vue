<template>
	<v-navigation-drawer v-model="drawer" :clipped="$vuetify.breakpoint.lgAndUp" app>
		<v-list dense>
			<template v-for="item in links">
				<v-list-item :key="item.text" link :to="item.to" v-if="checkVisibility(item.admin)">
					<v-list-item-action>
						<v-icon>{{ item.icon }}</v-icon>
					</v-list-item-action>
					<v-list-item-content>
						<v-list-item-title>{{ item.text }}</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
			</template>
		</v-list>
	</v-navigation-drawer>
</template>
<script>
export default {
	data: () => ({
		links: [
		{
				to: '/',
				icon: 'mdi-home-city',
				text: 'Inicio',
				admin: false
			},
			{
				to: '/clientes',
				icon: 'people',
				text: 'Clientes',
				admin: false
			},
			{
				to: '/seguradoras',
				icon: 'mdi-car-key',
				text: 'seguradoras',
				admin: false
			},
			{
				to: '/veiculos',
				icon: 'mdi-car-multiple',
				text: 'Veículos',
				admin: false
			},
			{
				to: '/usuarios',
				icon: 'mdi-account-group',
				text: 'Usuários',
				admin: true
			},
		]
	}),
	computed: {
		drawer: {
			get() {
				return this.$store.state.drawer
			},
			set(val) {
				this.$store.commit('setDrawer', val)
			}
		}
	},
	methods: {
		checkVisibility(admin) {
			return true
			// if (admin && this.$store.getters.userAdmin) {
			// 	return true
			// }
			// return !admin
		}
	}
}
</script>
