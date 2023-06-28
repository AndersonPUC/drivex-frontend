<template>
	<v-dialog v-model="locacaoDialog" max-width="1024">
		<v-form ref="form">
			<v-card>
				<v-card-title>
					<v-icon color="primary" left>mdi-home-city</v-icon>Nova locação: DRIVEX
					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
							<v-icon color="primary" right v-on="on">mdi-identifier</v-icon>
						</template>
						<span>{{ idLocacao }}</span>
					</v-tooltip>
					<v-spacer></v-spacer>
					<v-btn icon @click="dialogClose">
						<v-icon color="primary">close</v-icon>
					</v-btn>
				</v-card-title>
				<v-card-text>
					<v-row>
						<v-col cols="12" sm="1" md="1">
							<v-text-field label="ID" v-model="locacao.id" readonly></v-text-field>
						</v-col>
						<v-col cols="12" sm="2" md="2">
							<v-menu ref="dateMenuDtLocacao" v-model="dateMenuDtLocacao" :close-on-content-click="false"
								transition="scale-transition" offset-y max-width="290px" min-width="auto">
								<template v-slot:activator="{ on, attrs }">
									<v-text-field v-model="dateFormattedDtLocacao" label="Dt. Locação"
										prepend-icon="mdi-calendar" v-bind="attrs" v-on="on" readonly
										:rules="[rules.required]" />
								</template>
								<v-date-picker locale="pt-br" v-model="dateNFormattedDtLocacao" no-title
									@input="dateMenuDtLocacao = false"></v-date-picker>
							</v-menu>
						</v-col>
						<v-col cols="12" sm="2" md="2">
							<v-menu ref="dateMenuPrevEntrega" v-model="dateMenuPrevEntrega" :close-on-content-click="false"
								transition="scale-transition" offset-y max-width="290px" min-width="auto">
								<template v-slot:activator="{ on, attrs }">
									<v-text-field v-model="dateFormattedPrevEntrega" label="Prev. Entrega"
										prepend-icon="mdi-calendar" v-bind="attrs" v-on="on" readonly
										:rules="[rules.required]" />
								</template>
								<v-date-picker locale="pt-br" v-model="dateNFormattedPrevEntrega" no-title
									@input="dateMenuPrevEntrega = false"></v-date-picker>
							</v-menu>
						</v-col>
						<v-col cols="12" sm="3" md="3">
							<v-checkbox v-model="locacao.inativo" label="Lavagem Inclusa"></v-checkbox>
						</v-col>
						<v-col cols="12" sm="4" md="4">
							<v-row>
								<v-spacer />
								<v-card-title align-content="center">Custo Previsto: R$ {{ this.custoPrevisto
								}}</v-card-title>
							</v-row>
						</v-col>
					</v-row>
					<v-row>
						<v-col cols="12" sm="10" md="10">
							<v-select label="Cliente" :items="clientes" item-text="nome" item-value="id" v-model="clienteId"
								:rules="[rules.required]"></v-select>
						</v-col>
						<v-col cols="12" sm="2" md="2">
							<v-btn color="primary" text block><v-icon left>mdi-open-in-new</v-icon>Cliente</v-btn>
						</v-col>
					</v-row>
					<v-row>
						<v-col cols="12" sm="3" md="3">
							<v-select label="Categoria" :items="categorias" item-text="categoria" item-value="id"
								v-model="categoriaId" :rules="[rules.required]"></v-select>
						</v-col>
						<v-col cols="12" sm="3" md="3">
							<v-select label="Marca" :items="marcas" item-text="marca" item-value="id" v-model="marcaId"
								:rules="[rules.required]"></v-select>
						</v-col>
						<v-col cols="12" sm="4" md="4">
							<v-select label="Modelo" :items="modelos" item-text="modelo" item-value="id" v-model="modeloId"
								:rules="[rules.required]"></v-select>
						</v-col>
						<v-col cols="12" sm="2" md="2">
							<v-btn color="primary" text block><v-icon left>mdi-open-in-new</v-icon>Veiculo</v-btn>
						</v-col>
					</v-row>
					<v-row>
						<v-col cols="12" sm="2" md="2">
							<v-select label="Categoria" :items="nivelcombustivel" v-model="nivelCombustivelSelected"
								:rules="[rules.required]"></v-select>
						</v-col>
						<v-col cols="12" sm="2" md="2">
							<v-text-field label="KM Inicial" v-model="locacao.km_inicial" v-mask="'#########'"
								:rules="[rules.required]"></v-text-field>
						</v-col>
						<v-col cols="12" sm="2" md="2">
							<v-text-field label="KM Final" v-model="locacao.km_final" v-mask="'#########'"
								:rules="[rules.required]"></v-text-field>
						</v-col>
					</v-row>
					<v-row>
						<v-col cols="12" sm="12" md="12">
							<v-text-field label="OBS" v-model="locacao.observacoes"
								:rules="[rules.required]"></v-text-field>
						</v-col>
					</v-row>
					<v-row>
						<v-col cols="12" sm="12" md="12">
							<v-btn color="success"><v-icon left>mdi-content-save</v-icon>Salvar</v-btn>
							<v-btn color="error" @click="dialogClose" style="margin-left: 3px; margin-right: 3px;"
								text><v-icon left>mdi-cancel</v-icon>Cancelar</v-btn>
							<!-- <v-btn color="error"  style="margin-left: 3px; margin-right: 3px;" v-if="this.cliente.id && this.cliente.ativo"><v-icon
								left>mdi-delete</v-icon>Inativar</v-btn>
						<v-btn color="primary"  style="margin-left: 3px; margin-right: 3px;" v-if="this.cliente.id && !this.cliente.ativo"><v-icon
								left>mdi-recycle</v-icon>Recuperar</v-btn> -->
						</v-col>
					</v-row>
				</v-card-text>
				<v-card-actions>
					<v-progress-linear v-if="loading" indeterminate color="primary"></v-progress-linear>
				</v-card-actions>
			</v-card>
		</v-form>
	</v-dialog>
</template>
<script>
import { mapGetters, mapState } from 'vuex'

export default {
	props: {
		locacaoId: String,
		dialog: Boolean
	},
	data: function () {
		return {
			locacao: {},
			loading: false,
			dateMenuDtLocacao: false,
			dateNFormattedDtLocacao: '',
			dateFormattedDtLocacao: '',
			dateMenuPrevEntrega: false,
			dateNFormattedPrevEntrega: '',
			dateFormattedPrevEntrega: '',
			nivelCombustivelSelected: '4/4',
			clientes: [],
			categorias: [],
			marcas: [],
			modelos: [],
			nivelcombustivel: [
				'0',
				'1/4',
				'1/2',
				'3/4',
				'4/4',
			],
			clienteId: '',
			marcaId: '',
			modeloId: '',
			categoriaId: '',
			rules: {
				required: value => !!value || 'Informe um valor.',
				email: value => {
					const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
					return pattern.test(value) || 'E-mail invalido.'
				},
			},
		}
	},
	computed: {
		...mapGetters(['userAdmin']),
		...mapState(['user']),
		locacaoDialog: {
			get() {
				return this.dialog
			},
			set() {
				this.dialogClose()
			}
		},
		idLocacao() {
			if (!this.locacaoId) return "Novo"

			return this.locacaoId
		},
		custoPrevisto() {
			const valor = Number(280.98)
			return valor.toFixed(2).replace('.', ',')
		}
	},
	methods: {
		dialogClose() {
			this.tab = null
			this.seguradora = {}
			this.$emit('dialogClose')
		},
		formatDate(date) {
			if (!date) return null

			const [year, month, day] = date.split('-')
			return `${day}/${month}/${year}`
		},
		async loadLocacoes() {
			try {
				if (this.locacaoId == "0" || !this.locacaoId) return

				this.loading = true
				const response = await this.axios.get(`/locacoes/${this.locacaoId}`)
				this.locacao = response.data
			} catch (error) {
				this.$store.dispatch('showError', error)
			} finally {
				this.loading = false
			}
		},
		async loadClientes() {
			try {
				this.loading = true
				const response = await this.axios.get(`/manager/clientes`)
				this.clientes = response.data
			} catch (error) {
				this.$store.dispatch('showError', error)
			} finally {
				this.loading = false
			}
		},
		async loadCategorias() {
			try {
				this.loading = true
				const response = await this.axios.get(`/manager/categorias`)
				this.categorias = response.data
			} catch (error) {
				this.$store.dispatch('showError', error)
			} finally {
				this.loading = false
			}
		},
		async loadMarcas() {
			try {
				this.loading = true
				const response = await this.axios.get(`/manager/marcas/`, {
					params: { categoria: this.categoriaId }
				})
				this.marcas = response.data
			} catch (error) {
				this.$store.dispatch('showError', error)
			} finally {
				this.loading = false
			}
		},
		async loadModelos() {
			try {
				this.loading = true
				const response = await this.axios.get(`/manager/modelos`, {
					params: { categoria: this.categoriaId, marca: this.marcaId }
				})
				this.modelos = response.data
			} catch (error) {
				this.$store.dispatch('showError', error)
			} finally {
				this.loading = false
			}
		},
		getAllData() {
			this.loadClientes()
			this.loadCategorias()
		}
	},
	watch: {
		locacaoId() {
			this.getAllData()

			if (this.locacaoId)
				this.loadLocacoes()
		},
		dateNFormattedDtLocacao() {
			if (this.dateNFormattedDtLocacao)
				this.dateFormattedDtLocacao = this.formatDate(this.dateNFormattedDtLocacao)
		},
		dateNFormattedPrevEntrega() {
			if (this.dateNFormattedPrevEntrega)
				this.dateFormattedPrevEntrega = this.formatDate(this.dateNFormattedPrevEntrega)
		},
		categoriaId() {
			if(this.categoriaId)
				this.loadMarcas()
		},
		marcaId() {
			if(this.marcaId)
				this.loadModelos()
		}
	},
}
</script>
