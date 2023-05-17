<template>
	<div>
		<VeiculosDialog :dialog="dialog" :veiculoId="veiculoId" @dialogClose="dialogClose" />
		<v-card>
			<v-card-title>
				<v-icon left color="primary">mdi-car-hatchback</v-icon>Cadastro de Veículos
			</v-card-title>
			<v-card-text>
				<v-text-field
					v-model="search"
					append-icon="search"
					label="Pesquisar pelo Modelo, Marca ou Placa"
					single-line
					hide-details
				></v-text-field>
				<v-data-table
					:headers="headers"
					:items="veiculos"
					:options.sync="options"
					:server-items-length="total"
					class="elevation-1"
					:loading="loading"
					@click:row="veiculoSelected"
					dense>
					<template v-slot:[`item.role`]="{ item }" color="primary">
						{{ item.role == "admin_role" ? "Administrador" : "Usuário"  }}
					</template>
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
	import VeiculosDialog from '../components/veiculos/VeiculosDialog'

	export default {
		components: { VeiculosDialog },
		data: function() {
			return {
				veiculos: [],
				headers: [
					{ text: 'ID', value: 'id' },
					{ text: 'Marca', value: 'marca' },
					{ text: 'Modelo', value: 'modelo' },
					{ text: 'Placa', value: 'placa' },
					{ text: 'Criado em', value: 'createdAt' },
				],
				loading: false,
				search: '',
				options: {},
				total: 0,
				veiculoId: '',
				dialog: false,
			}
		},
		methods: {
			...mapActions('veiculos', ['showDialog']),
			async loadVeiculos() {
				try {
					this.loading = true
					const { sortBy, sortDesc, page, itemsPerPage } = this.options

					const response = await this.axios.get('/veiculos', {
						params: {
							page,
							limit: itemsPerPage,
							sortBy: sortBy[0],
							sortDesc: sortDesc[0],
							search: this.search,
						}
					})
					this.veiculos = response.data.veiculos
					this.total = response.data.total
				} catch (error) {
					this.$store.dispatch('showError', error)
				} finally {
					this.loading = false
				}
			},
			veiculoSelected(veiculo) {
				this.dialog = true
				this.veiculoId = veiculo.id
			},
			dialogClose() {
				this.veiculoId = ''
				this.dialog = false
				this.loadVeiculos()
			}
		},
		mounted() {
			this.loadVeiculos()
		},
		watch: {
			options: {
				handler() {
					this.loadVeiculos()
				},
				deep: true
			},
			search() {
				if(this.search.length > 3 || this.search.length == 0)
					this.loadVeiculos()
			}
		}
	}
</script>