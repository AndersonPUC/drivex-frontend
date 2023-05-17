<template>
	<div>
		<LocacaoDialog :dialog="dialog" :locacaoId="locacaoId" @dialogClose="dialogClose" />
		<v-card>
			<v-card-title>
				<v-icon left color="primary">mdi-handshake</v-icon>Locações
			</v-card-title>
			<v-card-text>
				<v-text-field
					v-model="search"
					append-icon="search"
					label="Pesquisar"
					single-line
					hide-details
				></v-text-field>
				<v-data-table
					:headers="headers"
					:items="locacoes"
					:options.sync="options"
					:server-items-length="total"
					class="elevation-1"
					:loading="loading"
					@click:row="locacaoSelected"
					dense>
				</v-data-table>
			</v-card-text>
		</v-card>
	</div>
</template>
<script>
	import { mapMutations, mapActions } from 'vuex'
	import LocacaoDialog from '../components/locacoes/LocacaoDialog'

	export default {
		components: { LocacaoDialog },
		data: function() {
			return {
				locacoes: [
                    {
                        id: 1,
                        dt_locacao: "13/05/2023",
                        dt_prev_entrega: "01/06/2023",
                        cliente: "Anderson Cesar",
                        km_inicial: "16500",
                        km_final: "---",
                        createdAt: "10/05/2023"
                    }
                ],
				headers: [
					{ text: 'ID', value: 'id' },
					{ text: 'Dt. Locação', value: 'dt_locacao' },
					{ text: 'Dt. Prev. Entrega', value: 'dt_prev_entrega' },
					{ text: 'Cliente', value: 'cliente' },
					{ text: 'Km Inicial', value: 'km_inicial' },
					{ text: 'Km Final', value: 'km_final' },
					{ text: 'Criado em', value: 'createdAt' },
				],
				loading: false,
				search: '',
				options: {},
				total: 1,
				locacaoId: '',
				dialog: false,
			}
		},
		methods: {
			...mapActions('veiculos', ['showDialog']),
			async loadLocacoes() {
				try {
					this.loading = true
                    /*
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
					this.locacoes = response.data.locacoes
					this.total = response.data.total
                    */
				} catch (error) {
					this.$store.dispatch('showError', error)
				} finally {
					this.loading = false
				}
			},
			locacaoSelected(locacao) {
				this.dialog = true
				this.locacaoId = locacao.id
			},
			dialogClose() {
				this.locacaoId = ''
				this.dialog = false
				this.loadLocacoes()
			}
		},
		mounted() {
			this.loadLocacoes()
		},
		watch: {
			options: {
				handler() {
					this.loadLocacoes()
				},
				deep: true
			},
			search() {
				if(this.search.length > 3 || this.search.length == 0)
					this.loadLocacoes()
			}
		}
	}
</script>