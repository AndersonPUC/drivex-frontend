<template>
	<v-navigation-drawer v-model="drawer" :clipped="$vuetify.breakpoint.lgAndUp" app>
		<v-list dense>
			<template v-for="item in links">
				<v-list-item :key="item.text" link :to="item.to" v-if="checkVisibility(item.role)">
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
		// 'admin_role', 'rental_role', 'insurance_role', 'user_role'
		links: [
		{
				to: '/',
				icon: 'mdi-home-city',
				text: 'Inicio',
				role: ['*']
			},
			{
				to: '/clientes',
				icon: 'people',
				text: 'Clientes',
				role: ['insurance_role']
			},
			{
				to: '/seguradoras',
				icon: 'mdi-car-key',
				text: 'seguradoras',
				role: ['rental_role']
			},
			{
				to: '/veiculos',
				icon: 'mdi-car-multiple',
				text: 'Veículos',
				role: ['rental_role']
			},
			{
				to: '/usuarios',
				icon: 'mdi-account-group',
				text: 'Usuários',
				role: ['*']
			},
			{
				to: '/locacoes',
				icon: 'mdi-handshake',
				text: 'Locações',
				role: ['insurance_role', 'rental_role']
			},
			{
				to: '/relatorios',
				icon: 'mdi-file-chart',
				text: 'Relatórios',
				role: ['*']
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
		checkVisibility(role) {
			if(role) {
				if(role.includes('*')) return true
				if(role && this.$store.getters.userAdmin) return true
				if(role.includes(this.$store.getters.userRole)) return true
			}
			
			return false
		}
	}
}
</script>
