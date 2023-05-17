<template>
	<div>
		<SeguradoraDialog :dialog="dialog" :seguradoraId="seguradoraId" @dialogClose="dialogClose" />
		<v-card>
			<v-card-title>
				<v-icon left color="primary">mdi-car-key</v-icon>Cadastro de Seguradoras
			</v-card-title>
			<v-card-text>
				<v-text-field
					v-model="search"
					append-icon="search"
					label="Pesquisar pelo CNPJ, Nome"
					single-line
					hide-details
				></v-text-field>
				<v-data-table
					:headers="headers"
					:items="seguradoras"
					:options.sync="options"
					:server-items-length="total"
					class="elevation-1"
					:loading="loading"
					@click:row="seguradoraSelected"
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
	import SeguradoraDialog from '../components/seguradoras/SeguradoraDialog'

	export default {
		components: { SeguradoraDialog },
		data: function() {
			return {
				seguradoras: [],
				headers: [
					{ text: 'ID', value: 'id' },
					{ text: 'CNPJ', value: 'cnpj' },
					{ text: 'Nome Fantasia', value: 'nome_fantasia' },
					{ text: 'Nome Social', value: 'nome_social' },
					{ text: 'E-mail', value: 'email' },
					{ text: 'Criado em', value: 'createdAt' },
				],
				loading: false,
				search: '',
				options: {},
				total: 0,
				seguradoraId: '',
				dialog: false,
			}
		},
		methods: {
			...mapActions('seguradoras', ['showDialog']),
			async loadSeguradoras() {
				try {
					this.loading = true
					const { sortBy, sortDesc, page, itemsPerPage } = this.options

					const response = await this.axios.get('/seguradoras', {
						params: {
							page,
							limit: itemsPerPage,
							sortBy: sortBy[0],
							sortDesc: sortDesc[0],
							search: this.search,
						}
					})
					this.seguradoras = response.data.seguradoras
					this.total = response.data.total
				} catch (error) {
					this.$store.dispatch('showError', error)
				} finally {
					this.loading = false
				}
			},
			seguradoraSelected(seguradora) {
				this.dialog = true
				this.seguradoraId = seguradora.id
			},
			dialogClose() {
				this.seguradoraId = ''
				this.dialog = false
				this.loadSeguradoras()
			}
		},
		mounted() {
			this.loadSeguradoras()
		},
		watch: {
			options: {
				handler() {
					this.loadSeguradoras()
				},
				deep: true
			},
			search() {
				if(this.search.length > 3 || this.search.length == 0)
					this.loadSeguradoras()
			}
		}
	}
</script>