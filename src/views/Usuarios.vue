<template>
	<div>
		<UsuarioDialog :dialog="dialog" :usuarioId="usuarioId" @dialogClose="dialogClose" />
		<v-card>
			<v-card-title>
				<v-icon left color="primary">mdi-account-group</v-icon>Cadastro de Usuários
			</v-card-title>
			<v-card-text>
				<v-row>
					<v-col cols="12" sm="12" md="12">
						<v-text-field v-model="search" append-icon="search" label="Pesquisar pelo Nome ou email" single-line
							hide-details></v-text-field>
					</v-col>
				</v-row>
				<v-row>
					<v-col cols="12" sm="12" md="12">
						<v-data-table :headers="headers" :items="usuarios" :options.sync="options"
							:server-items-length="total" class="elevation-1" :loading="loading"
							:footer-props="{ itemsPerPageText: 'Itens por página:', pageText: '{0}-{1} de {2}', 'items-per-page-options': [5, 10, 15, 30, 60, 100] }"
							@click:row="usuarioSelected" dense>
							<template v-slot:[`item.role`]="{ item }" color="primary">
								{{ getRole(item.role) }}
							</template>
							<template v-slot:[`item.createdAt`]="{ item }">
								{{ convertDate(item.createdAt) }}
							</template>
						</v-data-table></v-col>
				</v-row>
			</v-card-text>
		</v-card>
	</div>
</template>
<script>
import { mapMutations, mapActions } from 'vuex'
import UsuarioDialog from '../components/usuarios/UsuarioDialog'

export default {
	components: { UsuarioDialog },
	data: function () {
		return {
			usuarios: [],
			headers: [
				{ text: 'ID', value: 'id' },
				{ text: 'Nome', value: 'nome' },
				{ text: 'E-mail', value: 'email' },
				{ text: 'Papel', value: 'role' },
				{ text: 'Criado em', value: 'createdAt' },
			],
			loading: false,
			search: '',
			options: {},
			total: 0,
			usuarioId: '',
			dialog: false,
		}
	},
	methods: {
		...mapMutations('usuarios', ['setUsuario']),
		...mapActions('usuarios', ['showDialog']),
		async loadUsuarios() {
			try {
				this.loading = true
				const { sortBy, sortDesc, page, itemsPerPage } = this.options

				const response = await this.axios.get('/usuarios', {
					params: {
						page,
						limit: itemsPerPage,
						sortBy: sortBy[0],
						sortDesc: sortDesc[0],
						search: this.search,
					}
				})
				this.usuarios = response.data.usuarios
				this.total = response.data.total
			} catch (error) {
				this.$store.dispatch('showError', error)
			} finally {
				this.loading = false
			}
		},
		usuarioSelected(usuario) {
			this.dialog = true
			this.usuarioId = usuario.id
		},
		dialogClose() {
			this.usuarioId = ''
			this.dialog = false
			this.loadUsuarios()
		},
		getRole(item) {
			if (item == 'admin_role') {
				return 'Administrador'
			} else if (item == 'rental_role') {
				return 'Locadora'
			} else if (item == 'insurance_role') {
				return 'Seguradora'
			} else {
				return 'Usuário'
			}
		}
	},
	mounted() {
		this.loadUsuarios()
	},
	watch: {
		options: {
			handler() {
				this.loadUsuarios()
			},
			deep: true
		},
		search() {
			if (this.search.length > 3 || this.search.length == 0)
				this.loadUsuarios()
		}
	}
}
</script>