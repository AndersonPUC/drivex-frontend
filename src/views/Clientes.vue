<template>
	<div>
		<ClienteDialog :dialog="dialog" :clienteId="clienteId" @dialogClose="dialogClose" />
		<v-card>
			<v-card-title>
				<v-icon left color="primary">people</v-icon>Cadastro de Clientes
			</v-card-title>
			<v-card-text>
				<v-row>
					<v-col cols="11" sm="11" md="11">
						<v-text-field v-model="search" append-icon="search" label="Pesquisar pelo Nome, CPF ou E-mail"
							single-line hide-details></v-text-field>
					</v-col>
					<v-col cols="1" sm="1" md="1">
						<v-btn color="primary" text block @click="addCliente()">Novo<v-icon right dark>
								mdi-plus</v-icon></v-btn>
					</v-col>
				</v-row>
				<v-row>
					<v-col cols="12" sm="2" md="2">
						<v-checkbox v-model="inativo" label="Inativos"></v-checkbox>
					</v-col>
				</v-row>
				<v-row>
					<v-col cols="12" sm="12" md="12">
						<v-data-table :headers="headers" :items="clientes" :options.sync="options"
							:server-items-length="total" class="elevation-1"
							:footer-props="{ itemsPerPageText: 'Itens por página:', pageText: '{0}-{1} de {2}', 'items-per-page-options': [5, 10, 15, 30, 60, 100] }"
							:loading="loading" @click:row="clienteSelected" dense>
							<template v-slot:[`item.createdAt`]="{ item }"> {{ convertDate(item.createdAt) }} </template>
						</v-data-table>
					</v-col>
				</v-row>
			</v-card-text>
		</v-card>
	</div>
</template>
<script>
import { mapMutations, mapActions } from 'vuex'
import ClienteDialog from '../components/clientes/ClienteDialog'

export default {
	components: { ClienteDialog },
	data: function () {
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
			inativo: false,
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
						ativo: !this.inativo,
					}
				})
				this.clientes = response.data.clientes
				this.total = response.data.total
			} catch (error) {
				this.$store.dispatch('showError', error)
			} finally {
				this.loading = false
			}
		},
		loadClientesSearch() {
			this.options.page = 1
			this.loadClientes()
		},
		clienteSelected(cliente) {
			this.dialog = true
			this.clienteId = cliente.id
		},
		addCliente() {
			this.dialog = true
			this.clienteId = ''
		},
		dialogClose() {
			this.clienteId = ''
			this.dialog = false
			this.search = ''
			this.loadClientes()
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
			if (this.search.length > 3 || this.search.length == 0)
				this.loadClientesSearch()
		},
		inativo() {
			this.loadClientes()
		}
	}
}
</script>