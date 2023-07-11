<template>
	<div>
		<LocacaoDialog :dialog="dialog" :locacaoId="locacaoId" @dialogClose="dialogClose" />
		<v-card>
			<v-card-title>
				<v-icon left color="primary">mdi-handshake</v-icon>Locações
			</v-card-title>
			<v-card-text>
				<v-row>
					<!-- <v-col cols="11" sm="11" md="11">
						<v-text-field v-model="search" append-icon="search" label="Pesquisar" single-line
							hide-details></v-text-field>
					</v-col> -->
					<v-col cols="1" sm="1" md="1">
						<v-btn color="primary" text block @click="addLocacao()">Novo<v-icon right dark>
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
						<v-data-table :headers="headers" :items="locacoes" :options.sync="options"
							:server-items-length="total" class="elevation-1" :loading="loading" @click:row="locacaoSelected"
							:footer-props="{ itemsPerPageText: 'Itens por página:', pageText: '{0}-{1} de {2}', 'items-per-page-options': [5, 10, 15, 30, 60, 100] }"
							dense>
							<template v-slot:[`item.createdAt`]="{ item }"> {{ convertDate(item.createdAt) }} </template>
							<template v-slot:[`item.dt_locacao`]="{ item }"> {{ convertDate(item.dt_locacao) }} </template>
							<template v-slot:[`item.dt_previsao_entrega`]="{ item }"> {{
								convertDate(item.dt_previsao_entrega) }} </template>
							<template v-slot:[`item.dt_entrega`]="{ item }">
								<v-icon color="success" v-if="item.dt_entrega">mdi-check-circle</v-icon>
								<v-icon color="warning" v-if="!item.dt_entrega">mdi-timer-sand</v-icon>
								{{ getStatusText(item.dt_entrega) }}
							</template>
						</v-data-table>
					</v-col>
				</v-row>
			</v-card-text>
		</v-card>
	</div>
</template>
<script>
import { mapMutations, mapActions } from 'vuex'
import LocacaoDialog from '../components/locacoes/LocacaoDialog'

export default {
	components: { LocacaoDialog },
	data: function () {
		return {
			locacoes: [],
			headers: [
				{ text: 'ID', value: 'id' },
				{ text: 'Dt. Locação', value: 'dt_locacao' },
				{ text: 'Dt. Prev. Entrega', value: 'dt_previsao_entrega' },
				{ text: 'Cliente', value: 'cliente.nome' },
				{ text: 'Km Inicial', value: 'km_inicial' },
				{ text: 'Km Final', value: 'km_final' },
				{ text: 'Criado em', value: 'createdAt' },
				{ text: 'Status', value: 'dt_entrega' },
			],
			loading: false,
			// search: '',
			options: {},
			total: 1,
			locacaoId: '',
			dialog: false,
			inativo: false,
		}
	},
	methods: {
		...mapActions('veiculos', ['showDialog']),
		async loadLocacoes() {
			try {
				this.loading = true

				const { sortBy, sortDesc, page, itemsPerPage } = this.options

				const response = await this.axios.get('/locacoes', {
					params: {
						page,
						limit: itemsPerPage,
						sortBy: sortBy[0],
						sortDesc: sortDesc[0],
						// search: this.search,
						ativo: !this.inativo,
					}
				})

				this.locacoes = response.data.locacoes
				this.total = response.data.total

			} catch (error) {
				this.$store.dispatch('showError', error)
			} finally {
				this.loading = false
			}
		},
		loadLocacoesSearch() {
			this.options.page = 1
			this.loadLocacoes()
		},
		locacaoSelected(locacao) {
			this.dialog = true
			this.locacaoId = locacao.id
		},
		addLocacao() {
			this.dialog = true
			this.locacaoId = ''
		},
		dialogClose() {
			this.locacaoId = ''
			// this.search = ''
			this.dialog = false
			this.loadLocacoes()
		},
		getStatusText(item) {
			if (item) return "Entregue"
			else return "Aguardando entrega"
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
		// search() {
		// 	if (this.search.length > 3 || this.search.length == 0)
		// 		this.loadLocacoesSearch()
		// },
		inativo() {
			this.loadLocacoes()
		}
	}
}
</script>