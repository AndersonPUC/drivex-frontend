<template>
	<div>
		<v-alert v-if="!this.locacao.id" border="left" color="red" text type="info">Locação não encontrada.</v-alert>
		<v-card outlined color="transparent">
			<v-card-title>
				<v-progress-linear v-if="loading" indeterminate color="primary"></v-progress-linear>
			</v-card-title>
			<v-card-text>
				<v-row>
					<v-col cols="1" sm="1" md="1">
						<v-text-field label="ID" v-model="locacao.id" readonly></v-text-field>
					</v-col>
					<v-col cols="2" sm="2" md="2">
						<v-text-field label="Data da locação" v-model="dateFormattedDtLocacao" readonly></v-text-field>
					</v-col>
					<v-col cols="2" sm="3" md="3">
						<v-text-field label="Previsão de Entrega" v-model="dateFormattedPrevEntrega"
							readonly></v-text-field>
					</v-col>
					<v-col cols="3" sm="3" md="3">
						<v-text-field label="Lavagem inclusa" v-model="lavagemInclusa" readonly></v-text-field>
					</v-col>
					<v-col cols="3" sm="3" md="3">
						<v-row>
							<v-spacer />
							<v-card-text align-content="right" style="font-weight: bold;">Data Entrega
								{{ formatDate(this.locacao.dt_entrega.slice(0, 10)) }}</v-card-text>
						</v-row>
					</v-col>
				</v-row>

				<v-row>
					<v-col cols="12" sm="12" md="12">
						<v-text-field label="Cliente" v-model="this.locacao.cliente.nome" readonly></v-text-field>
					</v-col>
				</v-row>

				<v-row>
					<v-col cols="4" sm="4" md="4">
						<v-text-field label="Categoria" v-model="this.locacao.veiculo.categorium.categoria"
							readonly></v-text-field>
					</v-col>
					<v-col cols="4" sm="4" md="4">
						<v-text-field label="Marca" v-model="this.locacao.veiculo.marca" readonly></v-text-field>
					</v-col>
					<v-col cols="4" sm="4" md="4">
						<v-text-field label="Modelo" v-model="this.locacao.veiculo.modelo" readonly></v-text-field>
					</v-col>
				</v-row>
				<v-row>
					<v-col cols="2" sm="2" md="2">
						<v-text-field label="Modelo" v-model="this.locacao.nivel_combustivel" readonly></v-text-field>
					</v-col>
					<v-col cols="2" sm="2" md="2">
						<v-text-field label="KM Inicial" v-model="this.locacao.km_inicial" readonly></v-text-field>
					</v-col>
					<v-col cols="2" sm="2" md="2">
						<v-text-field label="KM Final" v-model="this.locacao.km_final" readonly></v-text-field>
					</v-col>
				</v-row>
				<v-row>
					<v-col cols="12" sm="12" md="12">
						<v-text-field label="OBS" v-model="this.locacao.observacoes" readonly></v-text-field>
					</v-col>
				</v-row>
			</v-card-text>
		</v-card>
	</div>
</template>

<script>
export default {
	name: 'Report',
	data: function () {
		return {
			loading: false,
			dialog: false,
			locacao: {},
			dateFormattedDtLocacao: '',
			dateFormattedPrevEntrega: '',
		}
	},
	methods: {
		async loadLocacoes() {
			try {
				if (this.$route.params.id == "0" || !this.$route.params.id) return
				this.loading = true
				const response = await this.axios.get(`/locacoes/${this.$route.params.id}`)
				this.locacao = response.data
				this.dateFormattedDtLocacao = this.formatDate(this.locacao.dt_locacao.slice(0, 10))
				this.dateFormattedPrevEntrega = this.formatDate(this.locacao.dt_previsao_entrega.slice(0, 10))

				await new Promise(resolve => setTimeout(resolve, 3000));
				window.print()
			} catch (error) {
				this.error
				// this.$store.dispatch('showError', error)
			} finally {
				this.loading = false
				
			}
		},
		formatDate(date) {
			if (!date) return null

			const [year, month, day] = date.split('-')
			return `${day}/${month}/${year}`
		},
	},
	computed: {
		lavagemInclusa() {
			return this.locacao.lavagem_inclusa ? 'Sim' : 'Não'
		}
	},
	mounted() {
		this.loadLocacoes()
	},
}
</script>
