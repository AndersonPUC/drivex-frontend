<template>
	<div>
		<ClienteDialog :dialog="dialog" :clienteId="clienteId" @dialogClose="dialogClose" />
		<v-card>
			<v-card-title>
				<v-icon left color="primary">people</v-icon>Cadastro de Clientes
			</v-card-title>
			<v-card-text>
				<v-text-field
					v-model="search"
					append-icon="search"
					label="Pesquisar pelo Nome, CPF ou E-mail"
					single-line
					hide-details
				></v-text-field>
				<v-data-table
					:headers="headers"
					:items="clientes"
					:options.sync="options"
					:server-items-length="total"
					class="elevation-1"
					:loading="loading"
					@click:row="clienteSelected"
					dense>
					<template v-slot:[`item.createdAt`]="{ item }">
						{{ convertDate(item.createdAt) }}
					</template>
				</v-data-table>
			</v-card-text>
		</v-card>
	</div>
</template>
<script>
	import { mapMutations, mapActions } from 'vuex'
	import ClienteDialog from '../components/clientes/ClienteDialog'

	export default {
		components: { ClienteDialog },
		data: function() {
			return {
				clientes: [],
				headers: [
					{ text: 'ID', value: 'id' },
					{ text: 'Nome', value: 'nome' },
					{ text: 'Sobrenome', value: 'sobrenome' },
					{ text: 'E-mail', value: 'email' },
					{ text: 'CPF', value: 'cpf' },
					{ text: 'Criado em', value: 'createdAt' },
				],
				loading: false,
				search: '',
				options: {},
				total: 0,
				clienteId: '',
				dialog: false,
			}
		},
		methods: {
			...mapMutations('usuarios', ['setUsuario']),
			...mapActions('usuarios', ['showDialog']),
			async loadClientes() {
				try {
					this.loading = true
					const { sortBy, sortDesc, page, itemsPerPage } = this.options

					const response = await this.axios.get('/clientes', {
						params: {
							page,
							limit: itemsPerPage,
							sortBy: sortBy[0],
							sortDesc: sortDesc[0],
							search: this.search,
						}
					})
					this.clientes = response.data
					this.total = response.data.total
				} catch (error) {
					this.$store.dispatch('showError', error)
				} finally {
					this.loading = false
				}
			},
			clienteSelected(cliente) {
				this.dialog = true
				this.clienteId = cliente.id
			},
			dialogClose() {
				this.usuarioId = ''
				this.dialog = false
				this.loadUsuarios()
			}
		},
		mounted() {
			this.loadClientes()
		},
		watch: {
			options: {
				handler() {
					this.loadClientes()
				},
				deep: true
			},
			search() {
				if(this.search.length > 3 || this.search.length == 0)
					this.loadClientes()
			}
		}
	}
</script>